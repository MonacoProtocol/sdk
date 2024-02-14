import { Subcategories } from "@monaco-protocol/event-client";
import { getProgram, logJson } from "../utils/utils";

const getAllSubCategories = async () => {
  const program = await getProgram();
  const connection = program.provider.connection;
  const subCategories = await Subcategories.subcategoryQuery(
    connection
  ).fetch();
  logJson(subCategories);
};

getAllSubCategories();
