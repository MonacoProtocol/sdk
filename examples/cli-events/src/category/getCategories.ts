import { Categories } from "@monaco-protocol/event-client";
import { getConnectionAndSigner, getProcessArgs, logJson } from "../utils/utils";

const getAllCategories = async () => {
  const { connection, keypair } = await getConnectionAndSigner();
  const categories = await Categories.categoryQuery(connection).filterByAuthority(keypair.publicKey).fetch();
  logJson(categories);
};

getProcessArgs([], "npm run getAllCategories");
getAllCategories();
