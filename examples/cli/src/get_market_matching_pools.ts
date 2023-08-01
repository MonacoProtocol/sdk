import { getAllMarketMatchingPools } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "./utils";
import { parseResponseData } from "./parsers/parsers";

async function marketMatchingPools(marketPk: PublicKey) {
  const program = await getProgram();
  const response = await getAllMarketMatchingPools(program, marketPk);
  response.data = parseResponseData(response.data)
  logResponse(response);
}

const args = getProcessArgs(["marketPk"], "npm run getMarketMatchingPools");
marketMatchingPools(new PublicKey(args.marketPk));
