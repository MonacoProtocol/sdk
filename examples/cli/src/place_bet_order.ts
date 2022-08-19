import { PublicKey } from "@solana/web3.js";
import { createBetOrderUiStake } from "@monacoprotocol/client";
import { getProgram, logJson, log } from "./utils";

async function placeBetOrder(marketPk: PublicKey){
    const program = await getProgram()
    const marketOutcomeIndex = 0
    const backing = true
    const odds = 1.5
    const stake = 1
    const betOrder = await createBetOrderUiStake(program, marketPk, marketOutcomeIndex, backing, odds, stake)
    if (!betOrder.success){
        log(betOrder.errors)
    }
    else{
        logJson(betOrder)
    }
}

const marketPk = new PublicKey("4R6w8Q52jjnXdJB26K9ML9zUSzthscP3EWhvNZ2WyiAS")
placeBetOrder(marketPk)
