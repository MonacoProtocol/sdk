import { getMarketPrices } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "./utils";

async function getMarketPricesByPk(marketPk: PublicKey) {
  const program = await getProgram();
  const response = await getMarketPrices(program, marketPk);
  logResponse(response);
}

const args = getProcessArgs(["marketPk"], "npm run getMarketPrices");
getMarketPricesByPk(new PublicKey(args.marketPk));
