import { Orders, OrderStatus } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, orderStatusFromString, logResponse } from "./utils";

async function getBetOrders(marketPk: PublicKey, status: OrderStatus){
    const program = await getProgram()
    const response = await Orders.orderQuery(program)
        .filterByMarket(marketPk)
        .filterByStatus(status)
        .fetch()
    logResponse(response)
}

const args = getProcessArgs(["marketPk", "orderStatus"], "npm run getOrdersForMarketByStatus")
getBetOrders(new PublicKey(args.marketPk), orderStatusFromString(args.orderStatus))
