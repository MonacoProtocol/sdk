import { Subcategories } from "@monaco-protocol/event-client";
import { getConnectionAndSigner, logJson } from "../utils/utils";

const getAllSubCategories = async () => {
  const { connection } = await getConnectionAndSigner();
  const subCategories = await Subcategories.subcategoryQuery(
    connection
  ).fetch();
  logJson(subCategories);
};

getAllSubCategories();
