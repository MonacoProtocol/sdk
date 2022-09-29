import { getMarketAccounts } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "./utils";

async function getAllMarketAccounts(
    marketPk: PublicKey,
    backing: boolean,
    marketOutcomeIndex: number,
    price: number,
) {
    const program = await getProgram()
    const response = await getMarketAccounts(
        program,
        marketPk,
        backing,
        marketOutcomeIndex,
        price,
    )
    logResponse(response)
}

const processArgs = getProcessArgs(["marketPk", "forOutcome", "marketOutcomeIndex", "price"], "npm run getMarketAccounts")
const marketPk = new PublicKey(processArgs.marketPk)
const forOutcome = processArgs.forOutcome === "true"
const marketOutcomeIndex = parseFloat(processArgs.marketOutcomeIndex)
const price = parseFloat(processArgs.price)
getAllMarketAccounts(marketPk, forOutcome, marketOutcomeIndex, price)