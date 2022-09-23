import { getOrdersByStatusForProviderWallet, OrderStatus } from "@monaco-protocol/client";
import { getProgram, getProcessArgs, orderStatusFromString, logResponse } from "./utils";

async function getBetOrders(status: OrderStatus){
    const program = await getProgram()
    const response = await getOrdersByStatusForProviderWallet(program, status)
    logResponse(response)
}

const processArgs = getProcessArgs(["orderStatus"], "npm run getOrdersByStatus")
const orderStatus = orderStatusFromString(processArgs.orderStatus)
getBetOrders(orderStatus)
