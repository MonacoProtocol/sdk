import { PublicKey } from "@solana/web3.js";
import { authoriseMarketOperator } from "@monaco-protocol/admin-client";
import { getProgram, getProcessArgs, logResponse } from "./utils";

async function addRole(newOperatorPk: PublicKey) {
  const program = await getProgram();
  const response = await authoriseMarketOperator(program, newOperatorPk);
  logResponse(response);
}

const args = getProcessArgs(["newOperatorPk"], "npm run addMarketOperator");
addRole(new PublicKey(args.newOperatorPk));
