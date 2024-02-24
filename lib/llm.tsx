import {
  ChatOpenAI,
} from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { BufferMemory, ChatMessageHistory, } from "langchain/memory";

import { ConversationalRetrievalQAChain } from "langchain/chains"
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
  CodeMaestro,
  Message,
} from '@/lib/actions';
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { getStore } from "./embeddings";

// example custom chain code rag
// https://js.langchain.com/docs/use_cases/code_understanding
const customRag = async (question: string, modelName: string, vectorStore: SupabaseVectorStore, memory: BufferMemory) => {
  const retriever = vectorStore.asRetriever({
    searchType: "mmr", // Use max marginal relevance search
    searchKwargs: { fetchK: 5 },
  });

  const model = new ChatOpenAI({ modelName: modelName }).pipe(
    new StringOutputParser()
  );

  const questionGeneratorTemplate = ChatPromptTemplate.fromMessages([
    AIMessagePromptTemplate.fromTemplate(
      "Given the following conversation about a codebase and a follow up question, rephrase the follow up question to be a standalone question."
    ),
    new MessagesPlaceholder("chat_history"),
    AIMessagePromptTemplate.fromTemplate(`Follow Up Input: {question}\nStandalone question:`),
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

  return conversationalQaChain.stream({
    question,
  });
}

// https://js.langchain.com/docs/modules/chains/popular/chat_vector_db_legacy
const preMadeRagChain = async (question: string, modelName: string, vectorStore: SupabaseVectorStore, memory: BufferMemory) => {
  const model = new ChatOpenAI({ modelName: modelName });
  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorStore.asRetriever(),
    {
      returnSourceDocuments: true,
      returnGeneratedQuestion: true,
    }
  );
  return chain
    .pipe(v => v.text as string)
    .stream({ question, chat_history: memory });
}

// const openAiFnRag = async (question: string, modelName: string, vectorStore: SupabaseVectorStore, memory: BufferMemory) => {
//   const llm = new ChatOpenAI({ modelName: modelName });
//   const agent = await createOpenAIFunctionsAgent({ llm });
//   const chain = ConversationalRetrievalQAChain.fromLLM(
//     model,
//     vectorStore.asRetriever(),
//     {
//       returnSourceDocuments: true,
//       returnGeneratedQuestion: true,
//     }
//   );
//   return chain
//     .pipe(v => v.text as string)
//     .stream({ question, chat_history: memory });
// }


export const chat = async (input: string, maestro: CodeMaestro, pastMessages: Message[], modelName: string) => {

  const vectorStore = await getStore(maestro);

  // console.log(pastMessages.slice(pastMessages.length - 6))

  // https://js.langchain.com/docs/modules/memory/chat_messages
  // https://js.langchain.com/docs/modules/memory/
  const history = new ChatMessageHistory();
  for (const pastMessage of pastMessages) {
    if (pastMessage.model_name) await history.addMessage(new AIMessage(pastMessage.message))
    else await history.addMessage(new HumanMessage(pastMessage.message));
  }

  // console.log(history)

  // TODO use https://js.langchain.com/docs/modules/memory/types/summary
  const memory = new BufferMemory({
    returnMessages: true, // Return stored messages as instances of `BaseMessage`
    memoryKey: "chat_history", // This must match up with our prompt template input variable.
    chatHistory: history,
  });

  return customRag(input, modelName, vectorStore, memory);
}