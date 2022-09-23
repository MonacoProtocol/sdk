import { getOrdersByStatusForProviderWallet, OrderStatus } from "@monaco-protocol/client";
import { getProgram, logJson, log, getProcessArgs, orderStatusFromString } from "./utils";

async function getBetOrders(status: OrderStatus){
    const program = await getProgram()
    const betOrders = await getOrdersByStatusForProviderWallet(program, status)
    if (!betOrders.success){
        log(betOrders.errors)
    }
    else{
        logJson(betOrders)
    }
}

const processArgs = getProcessArgs(["orderStatus"], "npm run getOrdersByStatus")
const orderStatus = orderStatusFromString(processArgs.orderStatus)
getBetOrders(orderStatus)
