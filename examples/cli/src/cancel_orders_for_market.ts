import { cancelOrdersForMarket } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "./utils";

async function cancelOrders(marketPk: PublicKey){
    const program = await getProgram()
    const response = await cancelOrdersForMarket(program, marketPk)
    logResponse(response)
}

const processArgs = getProcessArgs(["marketPk"], "npm run cancelOrders")
const marketPk = new PublicKey(processArgs.marketPk)
cancelOrders(marketPk)
