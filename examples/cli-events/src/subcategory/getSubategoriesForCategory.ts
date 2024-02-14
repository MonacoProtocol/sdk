import { Subcategories, findCategoryPda } from "@monaco-protocol/event-client";
import { getProcessArgs, getProgram, logJson } from "../utils/utils";

const getAllSubCategories = async (categoryCode: string) => {
  const program = await getProgram();
  const connection = program.provider.connection;
  const categoryPda = findCategoryPda(categoryCode, program);
  const subCategories = await Subcategories.subcategoryQuery(connection)
    .filterByCategory(categoryPda)
    .fetch();
  logJson(subCategories);
};

const args = getProcessArgs(
  ["categoryCode"],
  "npm run getSubcategoriesForCategory"
);
getAllSubCategories(args.categoryCode);
