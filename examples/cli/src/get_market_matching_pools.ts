import { getAllMarketMatchingPools  } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "./utils";

async function marketMatchingPools(marketPk: PublicKey) {
  const program = await getProgram();
  const response = await getAllMarketMatchingPools(program, marketPk);
  logResponse(response);
}

const args = getProcessArgs(["marketPk"], "npm run getMarketMatchingPools");
marketMatchingPools(new PublicKey(args.marketPk));
