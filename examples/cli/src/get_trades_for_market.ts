import { getTradesForMarket } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "./utils";
import { parseResponseData } from "./parsers/parsers";

async function getTrades(marketPk: PublicKey) {
  const program = await getProgram();
  const response = await getTradesForMarket(program, marketPk);
  response.data = parseResponseData(response.data);
  logResponse(response);
}

const args = getProcessArgs(["marketPk"], "npm run getTradesForMarket");
getTrades(new PublicKey(args.marketPk));
