import { Subcategories, findCategoryPda } from "@monaco-protocol/event-client";
import {
  getProcessArgs,
  getConnectionAndSigner,
  logJson
} from "../utils/utils";

const getAllSubCategories = async (categoryCode: string) => {
  const { connection, program } = await getConnectionAndSigner();
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
