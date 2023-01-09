import { getMarketOutcomesByMarket } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "./utils";

async function marketOutcomes(marketPk: PublicKey) {
  const program = await getProgram();
  const response = await getMarketOutcomesByMarket(program, marketPk);
  logResponse(response);
}

const args = getProcessArgs(["marketPk"], "npm run getMarketOutcomes");
marketOutcomes(new PublicKey(args.marketPk));
