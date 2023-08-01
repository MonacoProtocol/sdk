import { getMarketPrices } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "./utils";
import { parseResponseData } from "./parsers/parsers";

async function getMarketPricesByPk(marketPk: PublicKey) {
  const program = await getProgram();
  const response = await getMarketPrices(program, marketPk);
  response.data = parseResponseData(response.data)
  logResponse(response);
}

const args = getProcessArgs(["marketPk"], "npm run getMarketPrices");
getMarketPricesByPk(new PublicKey(args.marketPk));
