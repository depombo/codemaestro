
import { GithubRepoLoader } from "langchain/document_loaders/web/github";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { RecursiveCharacterTextSplitter, SupportedTextSplitterLanguages } from "langchain/text_splitter";
import { BufferMemory, ChatMessageHistory, VectorStoreRetrieverMemory } from "langchain/memory";

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
  getServerClient,
  CodeMaestro,
  Message,
} from '@/app/actions';
import { redirect } from "next/navigation";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

// https://js.langchain.com/docs/integrations/vectorstores/supabase
// https://js.langchain.com/docs/integrations/document_loaders/web_loaders/github
// https://js.langchain.com/docs/use_cases/rag/code_understanding

export const chat = async (input: string, maestro: CodeMaestro, pastMessages: Message[], modelName: string) => {

  const vectorStore = await getOrGenStore(maestro.github_repo_name);

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

  // https://js.langchain.com/docs/integrations/chat_memory
  // const memory1 = new VectorStoreRetrieverMemory({
  //   vectorStoreRetriever: vectorStore.asRetriever(5),
  //   memoryKey: 'chat_history',
  //   returnDocs: false,
  // });

  // await memory1.saveContext(
  //   { input: "My favorite food is pizza" },
  //   { output: "thats good to know" }
  // );

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

  const result = await conversationalQaChain.invoke({
    question: input,
  });

  // await memory.saveContext(
  //   {
  //     input: input,
  //   },
  //   {
  //     output: result,
  //   }
  // );

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

const isVectorStoreEmpty = async () => {
  const supabase = await getServerClient();
  let { data, error, count } = await supabase
    .from('documents')
    .select('*', { count: 'exact' })

  if (error) {
    console.error('Error checking Vector Store:', error);
    return false;
  }

  return count === 0;
}

const getOrGenStore = async (repo: string) => {
  const supabase = await getServerClient();
  const storeOpts = {
    client: supabase,
    tableName: "documents",
    queryName: "match_documents",
  };

  const isStoreEmpty = await isVectorStoreEmpty();
  if (!isStoreEmpty) {
    console.log('use existing embeddings')
    return await SupabaseVectorStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      storeOpts
    );
  }

  console.log('generating embeddings as none are availabe');
  const session = await getSession();
  if (!session) redirect('/signin')
  const loader = new GithubRepoLoader(
    repo,
    {
      accessToken: session.provider_token || '',
      branch: "main",
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
    docs.push(...await splitter.splitDocuments([doc]));
  }

  return await SupabaseVectorStore.fromDocuments(
    docs,
    new OpenAIEmbeddings(),
    storeOpts
  );

}
