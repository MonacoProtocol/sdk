import {
  EventGroups,
  findSubcategoryPda,
  findCategoryPda
} from "@monaco-protocol/event-client";
import { getProcessArgs, getProgram, logJson } from "../utils/utils";

const getAllEventGroups = async (
  categoryCode: string,
  subcategoryCode: string
) => {
  const program = await getProgram();
  const connection = program.provider.connection;
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
