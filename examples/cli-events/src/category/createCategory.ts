import {
  confirmTransaction,
  createCategory,
  findCategoryPda,
  signAndSendInstructions
} from "@monaco-protocol/event-client";
import { getProcessArgs, getConnectionAndSigner } from "../utils/utils";
import { SystemProgram } from "@solana/web3.js";

const addCategory = async (code: string, name: string) => {
  const { connection, keypair, program } = await getConnectionAndSigner();

  const pda = findCategoryPda(code, program);

  const accounts = {
    category: pda,
    payer: keypair.publicKey,
    systemProgram: SystemProgram.programId
  };

  const args = { name, code };

  const instruction = createCategory(args, accounts);
  const signature = await signAndSendInstructions(connection, keypair, [instruction]);
  await confirmTransaction(connection, signature);
};

const args = getProcessArgs(["code", "name"], "npm run addCategory");
addCategory(args.code, args.name);
