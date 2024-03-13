import {
  EventGroups,
  findSubcategoryPda,
  findCategoryPda
} from "@monaco-protocol/event-client";
import {
  getProcessArgs,
  getConnectionAndSigner,
  logJson
} from "../utils/utils";

const getAllEventGroups = async (
  categoryCode: string,
  subcategoryCode: string
) => {
  const { connection, program } = await getConnectionAndSigner();
  const categoryPda = findCategoryPda(categoryCode, program);
  const subcategoryPda = findSubcategoryPda(
    categoryPda,
    subcategoryCode,
    program
  );

  const eventGroups = await EventGroups.eventGroupQuery(connection)
    .filterBySubcategory(subcategoryPda)
    .fetch();
  logJson(eventGroups);
};

const args = getProcessArgs(
  ["categoryCode", "subcategoryCode"],
  "npm run getEventGroupsBySubcategory"
);
getAllEventGroups(args.categoryCode, args.subcategoryCode);
