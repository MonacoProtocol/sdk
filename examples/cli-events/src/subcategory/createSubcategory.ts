import {
  confirmTransaction,
  createSubcategory,
  signAndSendInstructions,
  findAssociatedPdasForSubcategory
} from "@monaco-protocol/event-client";
import { getProcessArgs, getConnectionAndSigner } from "../utils/utils";
import { SystemProgram } from "@solana/web3.js";

const createNewSubcategory = async (
  categoryCode: string,
  code: string,
  name: string
) => {
  const { connection, keypair, program } = await getConnectionAndSigner();

  const pdas = findAssociatedPdasForSubcategory(categoryCode, code, program);

  const accounts = {
    subcategory: pdas.subcategoryPda,
    category: pdas.categoryPda,
    payer: keypair.publicKey,
    systemProgram: SystemProgram.programId
  };

  const args = { code, name };

  const instruction = createSubcategory(args, accounts);
  const signature = await signAndSendInstructions(connection, keypair, [
    instruction
  ]);
  await confirmTransaction(connection, signature);
};

const args = getProcessArgs(
  ["categoryCode", "code", "name"],
  "npm run createSubcategory"
);
createNewSubcategory(args.categoryCode, args.code, args.name);
