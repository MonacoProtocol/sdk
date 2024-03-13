import {
  confirmTransaction,
  createEventGroup,
  signAndSendInstructions,
  findAssociatedPdasForEventGroup
} from "@monaco-protocol/event-client";
import { getProcessArgs, getConnectionAndSigner } from "../utils/utils";
import { SystemProgram } from "@solana/web3.js";

const createNewEventGroup = async (
  categoryCode: string,
  subCategoryCode: string,
  code: string,
  name: string
) => {
  const { connection, keypair, program } = await getConnectionAndSigner();

  const pdas = findAssociatedPdasForEventGroup(
    categoryCode,
    subCategoryCode,
    code,
    program
  );

  const accounts = {
    eventGroup: pdas.eventGroupPda,
    subcategory: pdas.subcategoryPda,
    payer: keypair.publicKey,
    systemProgram: SystemProgram.programId
  };

  const args = { code, name };
  const instruction = createEventGroup(args, accounts);
  const signature = await signAndSendInstructions(connection, keypair, [
    instruction
  ]);
  await confirmTransaction(connection, signature);
};

const args = getProcessArgs(
  ["categoryCode", "subCategoryCode", "code", "name"],
  "npm run createEventGroup"
);
createNewEventGroup(
  args.categoryCode,
  args.subCategoryCode,
  args.code,
  args.name
);
