
import { GithubRepoLoader } from "langchain/document_loaders/web/github";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { RecursiveCharacterTextSplitter, SupportedTextSplitterLanguages } from "langchain/text_splitter";
import { BufferMemory, ChatMessageHistory, } from "langchain/memory";
import { Document } from "@langchain/core/documents";

import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  AIMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";
import { StringOutputParser } from "@langchain/core/output_parsers";

import {
  getSession,
  CodeMaestro,
  Message,
  getUserDetails,
  updateGithubTokens,
} from '@/app/actions';
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { getServerClient } from "./supabase/server";

// https://js.langchain.com/docs/integrations/vectorstores/supabase
// https://js.langchain.com/docs/integrations/document_loaders/web_loaders/github
// https://js.langchain.com/docs/use_cases/rag/code_understanding

export const chat = async (input: string, maestro: CodeMaestro, pastMessages: Message[], modelName: string) => {

  const vectorStore = await getOrGenStore(maestro);

  const retriever = vectorStore.asRetriever({
    searchType: "mmr", // Use max marginal relevance search
    searchKwargs: { fetchK: 5 },
  });

  const model = new ChatOpenAI({ modelName: modelName }).pipe(
    new StringOutputParser()
  );

  // https://js.langchain.com/docs/modules/memory/chat_messages
  // https://js.langchain.com/docs/modules/memory/
  const history = new ChatMessageHistory();
  for (const pastMessage of pastMessages) {
    if (pastMessage.model_name) await history.addMessage(new AIMessage(pastMessage.message))
    else await history.addMessage(new HumanMessage(pastMessage.message));
  }
  const memory = new BufferMemory({
    returnMessages: true, // Return stored messages as instances of `BaseMessage`
    memoryKey: "chat_history", // This must match up with our prompt template input variable.
    chatHistory: history,
  });

  const questionGeneratorTemplate = ChatPromptTemplate.fromMessages([
    AIMessagePromptTemplate.fromTemplate(
      "Given the following conversation about a codebase and a follow up question, rephrase the follow up question to be a standalone question."
    ),
    new MessagesPlaceholder("chat_history"),
    AIMessagePromptTemplate.fromTemplate(`Follow Up Input: {question}
   Standalone question:`),
  ]);

  const combineDocumentsPrompt = ChatPromptTemplate.fromMessages([
    AIMessagePromptTemplate.fromTemplate(
      "Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.\n\n{context}\n\n"
    ),
    new MessagesPlaceholder("chat_history"),
    HumanMessagePromptTemplate.fromTemplate("Question: {question}"),
  ]);

  const combineDocumentsChain = RunnableSequence.from([
    {
      question: (output: string) => output,
      chat_history: async () => {
        const { chat_history } = await memory.loadMemoryVariables({});
        return chat_history;
      },
      context: async (output: string) => {
        const relevantDocs = await retriever.getRelevantDocuments(output);
        return formatDocumentsAsString(relevantDocs);
      },
    },
    combineDocumentsPrompt,
    model,
    new StringOutputParser(),
  ]);

  const conversationalQaChain = RunnableSequence.from([
    {
      question: (i: { question: string }) => i.question,
      chat_history: async () => {
        const { chat_history } = await memory.loadMemoryVariables({});
        return chat_history;
      },
    },
    questionGeneratorTemplate,
    model,
    new StringOutputParser(),
    combineDocumentsChain,
  ]);

  const result = await conversationalQaChain.stream({
    question: input,
  });

  return result;
}

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

const isRepoInVectorStore = async (repoUrl: string) => {
  const supabase = await getServerClient()
  let { data, error, count } = await supabase
    .from('documents')
    .select('*', { count: 'estimated' })
    .eq('metadata->>repository', repoUrl)

  if (error) {
    console.error('Error checking Vector Store:', error);
    return false;
  }

  const hasRepo = count && count > 0;
  if (hasRepo) console.log(`found embeddings for repo ${repoUrl}`)
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

const getRepoInfo = async (repoName: string, accessToken: string) => {
  const url = `https://api.github.com/repos/${repoName}`;
  const headers = {
    "User-Agent": "langchain",
    Authorization: `Bearer ${accessToken}`,
  };
  const response = await fetch(url, { headers: headers });
  const data = await response.json();
  if (response.ok) return { branch: data["default_branch"], private: data["private"] };
  throw new Error(`Unable to fetch access repo ${repoName}: ${response.status} ${JSON.stringify(data)}`);
}

const genRepo = async (repoName: string) => {
  const ghToken = await getGithubToken();
  const user = await getUserDetails();
  console.log(`generating embeddings for repo ${repoName}`);
  const repoInfo = await getRepoInfo(repoName, ghToken);
  const url = `https://github.com/${repoName}`;
  const loader = new GithubRepoLoader(
    url,
    {
      accessToken: ghToken,
      branch: repoInfo.branch,
      recursive: false,
      unknown: "warn",
      maxConcurrency: 5, // Defaults to 2
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
  console.log(`done generating embeddings for repo ${repoName}`)
}

const getOrGenStore = async (maestro: CodeMaestro) => {
  const repoNames = maestro.github_repo_names;
  const repoUrls = repoNames.map(n => `https://github.com/${n}`);
  for (let i = 0; i < repoUrls.length; i++) {
    const hasRepo = await isRepoInVectorStore(repoUrls[i]);
    if (!hasRepo) await genRepo(repoNames[i]);
  }
  const storeOpts = {
    client: await getServerClient(),
    tableName: "documents",
    queryName: "match_documents",
    filter: repoUrls.map(url => ({ repository: url }))
  };
  return await SupabaseVectorStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    storeOpts
  );
}
