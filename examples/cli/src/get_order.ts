import { getOrder } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "./utils";

async function getBetOrderbyPk(betOrderPk: PublicKey){
    const program = await getProgram()
    const response = await getOrder(program, betOrderPk)
    logResponse(response)
}

const processArgs = getProcessArgs(["betOrderPk"], "npm run getOrder")
const betOrderPk = new PublicKey(processArgs.betOrderPk)
getBetOrderbyPk(betOrderPk)
