import { getOrdersByStatusForProviderWallet, OrderStatus } from "@monaco-protocol/client";
import { getProgram, getProcessArgs, orderStatusFromString, logResponse } from "./utils";

async function getBetOrders(status: OrderStatus){
    const program = await getProgram()
    const response = await getOrdersByStatusForProviderWallet(program, status)
    logResponse(response)
}

const args = getProcessArgs(["orderStatus"], "npm run getOrdersByStatus")
getBetOrders(orderStatusFromString(args.orderStatus))
