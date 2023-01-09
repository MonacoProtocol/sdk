import { cancelOrdersForMarket } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "./utils";

async function cancelOrders(marketPk: PublicKey) {
  const program = await getProgram();
  const response = await cancelOrdersForMarket(program, marketPk);
  logResponse(response);
}

const args = getProcessArgs(["marketPk"], "npm run cancelOrders");
cancelOrders(new PublicKey(args.marketPk));
