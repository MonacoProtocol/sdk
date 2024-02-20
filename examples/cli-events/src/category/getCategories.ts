import { Categories } from "@monaco-protocol/event-client";
import { getConnectionAndSigner, getProcessArgs, logJson } from "../utils/utils";

const getAllCategories = async () => {
  const { connection } = await getConnectionAndSigner();
  const categories = await Categories.categoryQuery(connection).fetch();
  logJson(categories);
};

getProcessArgs([], "npm run getAllCategories");
getAllCategories();
