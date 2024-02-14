import {
  confirmTransaction,
  findSubcategoryPda,
  findCategoryPda,
  findEventGroupPda,
  createEventGroup,
  signAndSendInstructions
} from "@monaco-protocol/event-client";
import { getProcessArgs, getProgram } from "../utils/utils";
import { web3 } from "@coral-xyz/anchor";

const createNewEventGroup = async (
  categoryCode: string,
  subCategoryCode: string,
  code: string,
  name: string
) => {
  const program = await getProgram();

  const categoryPda = findCategoryPda(categoryCode, program);
  const subcategoryPda = findSubcategoryPda(
    categoryPda,
    subCategoryCode,
    program
  );
  const eventGroupPda = findEventGroupPda(subcategoryPda, code, program);

  const accounts = {
    eventGroup: eventGroupPda,
    subcategory: subcategoryPda,
    payer: program.provider.publicKey,
    systemProgram: web3.SystemProgram.programId
  };

  const args = { code, name };
  const instruction = createEventGroup(args, accounts);
  const signature = await signAndSendInstructions(program, [instruction]);
  await confirmTransaction(program, signature);
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
