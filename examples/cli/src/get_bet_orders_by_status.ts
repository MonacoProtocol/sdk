import { getBetOrdersByStatusForProviderWallet, BetOrderStatus } from "@betdexlabs/betdex-client";
import { getProgram, logJson, log } from "./utils";

async function getBetOrders(status: BetOrderStatus){
    const program = await getProgram()
    const betOrders = await getBetOrdersByStatusForProviderWallet(program, status)
    if (!betOrders.success){
        log(betOrders.errors)
    }
    else{
        logJson(betOrders)
    }
}

getBetOrders(BetOrderStatus.Matched)
