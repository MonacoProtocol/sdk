import {
  confirmTransaction,
  findSubcategoryPda,
  findCategoryPda,
  findEventGroupPda,
  findEventPda,
  createEvent,
  signAndSendInstructions
} from "@monaco-protocol/event-client";
import { getProcessArgs, getProgram, logJson } from "../utils/utils";
import { BN, web3 } from "@coral-xyz/anchor";

const createNewEvent = async () => {
  const program = await getProgram();

  const categoryCode = "MOVIES";
  const subCategoryCode = "UKBOX";
  const eventGroupCode = "WEEKBOX";

  const expectedStartTimestamp = 2524608000;
  const eventCode = `${subCategoryCode}-${eventGroupCode}-WEEK-1-2050`;

  const categoryPda = findCategoryPda(categoryCode, program);
  const subcategoryPda = findSubcategoryPda(
    categoryPda,
    subCategoryCode,
    program
  );
  const eventGroupPda = findEventGroupPda(
    subcategoryPda,
    eventGroupCode,
    program
  );
  const eventPda = findEventPda(eventCode, program);

  const args = {
    eventInfo: {
      code: eventCode,
      name: "Week 1 - 2025",
      expectedStartTimestamp: new BN(expectedStartTimestamp),
      actualStartTimestamp: null,
      actualEndTimestamp: null
    }
  };
  const accounts = {
    event: eventPda,
    eventGroup: eventGroupPda,
    subcategory: subcategoryPda,
    authority: program.provider.publicKey,
    systemProgram: web3.SystemProgram.programId
  };
  const instruction = createEvent(args, accounts);
  const signature = await signAndSendInstructions(program, [instruction]);
  await confirmTransaction(program, signature);

  const event = await program.account.event.fetch(eventPda);
  logJson(event);
};

getProcessArgs([], "npm run createEvent");
createNewEvent();
