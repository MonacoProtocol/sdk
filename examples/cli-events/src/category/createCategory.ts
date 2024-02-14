import {
  confirmTransaction,
  createCategory,
  findCategoryPda,
  signAndSendInstructions
} from "@monaco-protocol/event-client";
import { web3 } from "@coral-xyz/anchor";
import { getProcessArgs, getProgram } from "../utils/utils";

const addCategory = async (code: string, name: string) => {
  const program = await getProgram();

  const pda = findCategoryPda(code, program);

  const accounts = {
    category: pda,
    payer: program.provider.publicKey,
    systemProgram: web3.SystemProgram.programId
  };

  const args = { name, code };

  const instruction = createCategory(args, accounts);
  const signature = await signAndSendInstructions(program, [instruction]);
  await confirmTransaction(program, signature);
};

const args = getProcessArgs(["code", "name"], "npm run addCategory");
addCategory(args.code, args.name);
