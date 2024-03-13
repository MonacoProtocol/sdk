import {
  Participants,
  findCategoryPda,
  findSubcategoryPda
} from "@monaco-protocol/event-client";
import {
  getProcessArgs,
  getConnectionAndSigner,
  logJson
} from "../utils/utils";

const getAllParticipants = async (
  categoryCode: string,
  subcategoryCode: string
) => {
  const { connection, program, keypair } = await getConnectionAndSigner();

  const categoryPda = findCategoryPda(categoryCode, program);
  const subcategoryPda = findSubcategoryPda(
    categoryPda,
    subcategoryCode,
    program
  );

  const participants = await Participants.participantQuery(connection)
    .filterBySubcategory(subcategoryPda)
    .fetch();
  logJson(participants);
};

const args = getProcessArgs(
  ["categoryCode", "subcategoryCode"],
  "npm run getParticipantsForSubcategory"
);
getAllParticipants(args.categoryCode, args.subcategoryCode);
