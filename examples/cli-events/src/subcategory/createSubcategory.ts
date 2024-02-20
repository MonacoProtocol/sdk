import {
  confirmTransaction,
  findSubcategoryPda,
  findCategoryPda,
  createSubcategory,
  signAndSendInstructions
} from "@monaco-protocol/event-client";
import { getProcessArgs, getConnectionAndSigner } from "../utils/utils";
import { SystemProgram } from "@solana/web3.js";

const createNewSubcategory = async (
  categoryCode: string,
  code: string,
  name: string
) => {
  const { connection, keypair, program } = await getConnectionAndSigner();

  const categoryPda = findCategoryPda(categoryCode, program);
  const subcategoryPda = findSubcategoryPda(categoryPda, code, program);

  const accounts = {
    subcategory: subcategoryPda,
    category: categoryPda,
    payer: keypair.publicKey,
    systemProgram: SystemProgram.programId
  };

  const args = { code, name };

  const instruction = createSubcategory(args, accounts);
  const signature = await signAndSendInstructions(connection, keypair, [instruction]);
  await confirmTransaction(connection, signature);
};

const args = getProcessArgs(
  ["categoryCode", "code", "name"],
  "npm run createSubcategory"
);
createNewSubcategory(args.categoryCode, args.code, args.name);
