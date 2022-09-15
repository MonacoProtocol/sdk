import { PublicKey } from "@solana/web3.js";
import { createOrderUiStake } from "@monaco-protocol/client";
import { getProgram, logJson, log } from "./utils";

async function placeOrder(marketPk: PublicKey){
    const program = await getProgram()
    const marketOutcomeIndex = 0
    const forOutcome = false
    const odds = 2
    const stake = 1
    const betOrder = await createOrderUiStake(program, marketPk, marketOutcomeIndex, forOutcome, odds, stake)
    if (!betOrder.success){
        log(betOrder.errors)
    }
    else{
        logJson(betOrder)
    }
}

const marketPk = new PublicKey("CCJqgUHtTZcMtkjAuqJuTJoRA78gWpgeRRtbt7tNcZVi")
placeOrder(marketPk)
