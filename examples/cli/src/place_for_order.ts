import { PublicKey } from "@solana/web3.js";
import { createOrderUiStake } from "@monaco-protocol/client";
import { getProgram, getProcessArgs, logResponse } from "./utils";

async function placeOrder(marketPk: PublicKey){
    const program = await getProgram()
    const marketOutcomeIndex = 0
    const forOutcome = true
    const price = 2
    const stake = 1
    const response = await createOrderUiStake(program, marketPk, marketOutcomeIndex, forOutcome, price, stake)
    logResponse(response)
}

const processArgs = getProcessArgs(["marketPk"], "npm run placeAgainstOrder")
const marketPk = new PublicKey(processArgs.marketPk)
placeOrder(marketPk)
