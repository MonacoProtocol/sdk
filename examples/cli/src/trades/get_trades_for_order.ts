import { getTradesForOrder } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "../utils/utils";
import { parseResponseData } from "../parsers/parsers";

async function getTrades(marketPk: PublicKey) {
  const program = await getProgram();
  const response = await getTradesForOrder(program, marketPk);
  response.data = parseResponseData(response.data);
  logResponse(response);
}

const args = getProcessArgs(["betOrderPk"], "npm run getTradesForOrder");
getTrades(new PublicKey(args.betOrderPk));
