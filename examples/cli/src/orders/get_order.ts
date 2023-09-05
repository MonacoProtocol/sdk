import { getOrder } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "../utils/utils";
import { parseResponseData } from "../parsers/parsers";

async function getBetOrderbyPk(betOrderPk: PublicKey) {
  const program = await getProgram();
  const response = await getOrder(program, betOrderPk);
  response.data = parseResponseData(response.data)
  logResponse(response);
}

const args = getProcessArgs(["betOrderPk"], "npm run getOrder");
getBetOrderbyPk(new PublicKey(args.betOrderPk));
