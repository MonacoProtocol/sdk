import { getTradesForOrder } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "./utils";

async function getTrades(marketPk: PublicKey){
    const program = await getProgram()
    const response = await getTradesForOrder(program, marketPk)
    logResponse(response)
}

const args = getProcessArgs(["betOrderPk"], "npm run getTradesForOrder")
getTrades(new PublicKey(args.betOrderPk))
