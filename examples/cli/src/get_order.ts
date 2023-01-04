import { getOrder } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "./utils";

async function getBetOrderbyPk(betOrderPk: PublicKey){
    const program = await getProgram()
    const response = await getOrder(program, betOrderPk)
    logResponse(response)
}

const args = getProcessArgs(["betOrderPk"], "npm run getOrder")
getBetOrderbyPk(new PublicKey(args.betOrderPk))
