import { PublicKey } from "@solana/web3.js";
import { settleMarket } from "@monaco-protocol/admin-client";
import { getProgram, getProcessArgs, logResponse } from "./utils";

async function settlement(marketPk: PublicKey, winningOutcomeIndex: number) {
  const program = await getProgram();
  const response = await settleMarket(program, marketPk, winningOutcomeIndex);
  logResponse(response);
}

const args = getProcessArgs(
  ["marketPk", "winningOutcomeIndex"],
  "npm run settleMarket"
);
settlement(new PublicKey(args.marketPk), parseFloat(args.winningOutcomeIndex));
