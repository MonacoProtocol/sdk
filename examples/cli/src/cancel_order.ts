import { cancelOrder } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "./utils";

async function cancelOrderbyPk(orderPk: PublicKey){
    const program = await getProgram()
    const response = await cancelOrder(program, orderPk)
    logResponse(response)
}

const processArgs = getProcessArgs(["orderPk"], "npm run cancelOrder")
const orderPk = new PublicKey(processArgs.orderPk)
cancelOrderbyPk(orderPk)
