import { getOrdersByStatusForProviderWallet, OrderStatus } from "@monaco-protocol/client";
import { getProgram, logJson, log } from "./utils";

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

getBetOrders(OrderStatus.Matched)
