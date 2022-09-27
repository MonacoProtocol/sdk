import { getTradesForOrder } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "./utils";

async function getTrades(marketPk: PublicKey){
    const program = await getProgram()
    const response = await getTradesForOrder(program, marketPk)
    logResponse(response)
}

const processArgs = getProcessArgs(["betOrderPk"], "npm run getTradesForOrder")
const betOrderPk = new PublicKey(processArgs.betOrderPk)
getTrades(betOrderPk)
