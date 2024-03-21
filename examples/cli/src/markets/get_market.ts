import { getMarket } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "../utils/utils";
import { parseResponseData } from "../parsers/parsers";

async function getMarketByPk(marketPk: PublicKey) {
  const program = await getProgram();
  const response = await getMarket(program, marketPk);
  response.data = parseResponseData(response.data);
  logResponse(response);
}

const args = getProcessArgs(["marketPk"], "npm run getMarket");
getMarketByPk(new PublicKey(args.marketPk));
