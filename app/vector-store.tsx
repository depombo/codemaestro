
import { GithubRepoLoader } from "langchain/document_loaders/web/github";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { RecursiveCharacterTextSplitter, SupportedTextSplitterLanguages } from "langchain/text_splitter";
import {
  getServerClient,
} from '@/app/supabase-server';

const genEmbeddings = async() => {

  const supabase = await getServerClient();
  const loader = new GithubRepoLoader(
    "https://github.com/depombo/lfdepombo.com",
    {
      branch: "main",
      recursive: false,
      unknown: "warn",
      maxConcurrency: 5, // Defaults to 2
    }
  );


  const getSplitterForFileType = async (file: string) => {
    const extension = file.split('.').pop() as any;
    let fileType;
    switch(extension) {
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
        BarProp;
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

  const docs = [];
  // console.log(SupportedTextSplitterLanguages);
  for await (const doc of loader.loadAsStream()) {
    const splitter = await getSplitterForFileType(doc.metadata.source);
    // console.log(splitter);
    docs.push(...await splitter.splitDocuments([doc]));
  }


  return await SupabaseVectorStore.fromDocuments(
    docs,
    new OpenAIEmbeddings(),
    {
      client: supabase,
      tableName: "documents",
      queryName: "match_documents",
    }
  );

}