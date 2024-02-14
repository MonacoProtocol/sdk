import { Categories } from "@monaco-protocol/event-client";
import { getProcessArgs, getProgram, logJson } from "../utils/utils";

const getAllCategories = async () => {
  const program = await getProgram();
  const connection = program.provider.connection;
  const categories = await Categories.categoryQuery(connection).fetch();
  logJson(categories);
};

getProcessArgs([], "npm run getAllCategories");
getAllCategories();
