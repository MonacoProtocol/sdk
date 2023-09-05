import { getMarketOutcomesByMarket } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "../utils/utils";
import { parseResponseData } from "../parsers/parsers";

async function marketOutcomes(marketPk: PublicKey) {
  const program = await getProgram();
  const response = await getMarketOutcomesByMarket(program, marketPk);
  response.data = parseResponseData(response.data)
  logResponse(response);
}

const args = getProcessArgs(["marketPk"], "npm run getMarketOutcomes");
marketOutcomes(new PublicKey(args.marketPk));
