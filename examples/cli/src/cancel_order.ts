import { cancelOrder } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "./utils";

async function cancelOrderbyPk(orderPk: PublicKey){
    const program = await getProgram()
    const response = await cancelOrder(program, orderPk)
    logResponse(response)
}

const args = getProcessArgs(["orderPk"], "npm run cancelOrder")
cancelOrderbyPk(new PublicKey(args.orderPk))
