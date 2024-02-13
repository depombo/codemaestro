import { GithubRepoLoader } from "langchain/document_loaders/web/github";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import {
  OpenAIEmbeddings,
} from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { RecursiveCharacterTextSplitter, SupportedTextSplitterLanguages } from "langchain/text_splitter";
import { Document } from "@langchain/core/documents";
import { SupabaseHybridSearch } from "@langchain/community/retrievers/supabase";

import {
  CodeMaestro,
  getUserDetails,
  updateGithubTokens,
} from '@/app/actions';
import { getServerClient } from "./supabase/server";

// https://js.langchain.com/docs/integrations/vectorstores/supabase
// https://js.langchain.com/docs/integrations/document_loaders/web_loaders/github

export const getRelevantDocs = async (query: string) => {
  const embeddings = new OpenAIEmbeddings();

  const retriever = new SupabaseHybridSearch(embeddings, {
    client: await getServerClient(),
    similarityK: 2,
    keywordK: 2,
    tableName: "documents",
    similarityQueryName: "match_documents",
    keywordQueryName: "kw_match_documents",
  });

  return retriever.getRelevantDocuments(query);
};

const getSplitterForFileType = async (file: string) => {
  const extension = file.split('.').pop() as any;
  let fileType;
  switch (extension) {
    case "mdx":
    case "md":
      fileType = "markdown";
      break;
    case "ts":
    case "tsx":
    case "jsx":
      fileType = "js"
      break;
    case "py":
      fileType = "python";
      break;
    case "rs":
      fileType = "rust";
      break;
    default:
      fileType = extension
  }
  const splitterOpts = {
    // chunkSize: 2000,
    // chunkOverlap: 200,
  };
  // console.log(SupportedTextSplitterLanguages.includes(fileType), fileType)
  return SupportedTextSplitterLanguages.includes(fileType) ?
    RecursiveCharacterTextSplitter.fromLanguage(fileType, splitterOpts) :
    new RecursiveCharacterTextSplitter(splitterOpts);
};

const isSrcInVectorStore = async (url: string) => {
  const supabase = await getServerClient()
  let { data, error, count } = await supabase
    .from('documents')
    .select('*', { count: 'estimated' })
    .or(`metadata->>repository.eq.${url},metadata->>source.eq.${url}`)

  if (error) {
    console.error('Error checking Vector Store:', error);
    return false;
  }

  const hasRepo = count && count > 0;
  if (hasRepo) console.log(`found embeddings for src ${url}`)
  return hasRepo;
}

const getGithubToken = async () => {
  const user = await getUserDetails();
  const ghToken = user?.github_provider_token;
  const headers = {
    "User-Agent": "langchain",
    Authorization: `Bearer ${ghToken}`,
  };
  const response = await fetch(
    "https://api.github.com/user/repos",
    { headers: headers }
  );
  const data = await response.json();
  // token is good to return
  if (response.ok) return ghToken;
  // refresh token, save it and return
  //  https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/refreshing-user-access-tokens
  if (response.status === 401) {
    const response = await fetch(
      "https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: user?.github_provider_refresh_token,
        client_id: process.env.GITHUB_APP_CLIENT_ID!,
        client_secret: process.env.GITHUB_APP_CLIENT_SECRET!,
      }),
    });
    const body = await response.json();
    await updateGithubTokens(body.provider_token, body.provider_refresh_token);
    return body.provider_token;
  }
  throw new Error(`Unable to fetch access repos for user: ${response.status} ${JSON.stringify(data)}`);
}

// TODO context file
// const isSrcValid = async

type RepoName = {
  owner: string;
  repo: string;
  path: string
}

export const isSrcPrivate = async (url: string) => {
  const repoParts = extractOwnerAndRepoAndPath(url);
  if (!repoParts) return false;
  const ghToken = await getGithubToken();
  const repoInfo = await getRepoInfo(repoParts, ghToken);
  return repoInfo.private;
}

const getRepoInfo = async (repoName: RepoName, accessToken: string) => {
  const url = `https://api.github.com/repos/${repoName.owner}/${repoName.repo}`;
  const headers = {
    "User-Agent": "langchain",
    Authorization: `Bearer ${accessToken}`,
  };
  const response = await fetch(url, { headers: headers });
  const data = await response.json();
  if (response.ok) return { branch: data["default_branch"], private: data["private"] };
  throw new Error(`Unable to fetch access repo ${repoName.owner}/${repoName.repo}: ${response.status} ${JSON.stringify(data)}`);
}

const genRepo = async (repoName: RepoName) => {
  const ghToken = await getGithubToken();
  const user = await getUserDetails();
  console.log(`generating embeddings for repo ${repoName.owner}/${repoName.repo}`);
  const repoInfo = await getRepoInfo(repoName, ghToken);
  const url = `https://github.com/${repoName.owner}/${repoName.repo}`;
  const loader = new GithubRepoLoader(
    url,
    {
      accessToken: ghToken,
      branch: repoInfo.branch,
      recursive: true,
      unknown: "warn",
      maxConcurrency: 5, // Defaults to 2
      // ignore lock files, .gitignore and any dotfile
      ignorePaths: ['package-lock.json', '.*', '*.lock']
    }
  );
  const docs = [];
  // console.log(SupportedTextSplitterLanguages);
  for await (const doc of loader.loadAsStream()) {
    const splitter = await getSplitterForFileType(doc.metadata.source);
    // console.log(splitter);
    const docWithMeta = new Document({
      pageContent: doc.pageContent,
      metadata: repoInfo.private ? {
        ...doc.metadata,
        "user_id": user?.id
      } : doc.metadata
    });
    docs.push(...await splitter.splitDocuments([docWithMeta]));
    // docs.push(...await splitter.splitDocuments([doc]));
  }
  await SupabaseVectorStore.fromDocuments(
    docs,
    new OpenAIEmbeddings(),
    {
      client: await getServerClient(),
      tableName: "documents",
      queryName: "match_documents",
      filter: [{ repository: url }]
    }
  );
  console.log(`done generating embeddings for repo ${repoName.owner}/${repoName.repo}`)
}

const genUrl = async (url: string) => {
  console.log(`generating embeddings for URL ${url}`);
  const loader = new CheerioWebBaseLoader(url);

  const docs = await loader.loadAndSplit();
  await SupabaseVectorStore.fromDocuments(
    docs,
    new OpenAIEmbeddings(),
    {
      client: await getServerClient(),
      tableName: "documents",
      queryName: "match_documents",
      filter: [{ repository: url }]
    }
  );
  console.log(`done generating embeddings for URL ${url}`)
}

const GITHUB_BASE_URL = "https://github.com"

const extractOwnerAndRepoAndPath = (url: string): RepoName | null => {
  const match = url.match(new RegExp(`${GITHUB_BASE_URL}/([^/]+)/([^/]+)(/tree/[^/]+/(.+))?`, "i"));
  if (!match) return null;
  return { owner: match[1], repo: match[2], path: match[4] || "" };
}

export const getStore = async (maestro: CodeMaestro) => {
  await genStore(maestro);
  const storeOpts = {
    client: await getServerClient(),
    tableName: "documents",
    queryName: "match_documents",
    filter: maestro.context_sources.map(s => ({ repository: s.url }))
  };
  return await SupabaseVectorStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    storeOpts
  );
}

export const genStore = async (maestro: CodeMaestro) => {
  for (const src of maestro.context_sources) {
    const hasSrc = await isSrcInVectorStore(src.url);
    if (hasSrc) continue;
    const repoParts = extractOwnerAndRepoAndPath(src.url)
    if (repoParts !== null) {
      await genRepo(repoParts);
    } else {
      await genUrl(src.url);
    }
    const supabase = await getServerClient();
    const { error } = await supabase
      .from("context_source")
      .update({ last_updated: Date.now() })
      .eq("id", src.id);
    if (error) {
      console.error(error);
    }
  }
}