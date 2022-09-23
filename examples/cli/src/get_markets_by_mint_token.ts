import { getMarketAccountsByStatusAndMintAccount, MarketStatus } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, marketStatusFromString, logResponse } from "./utils";

async function getMarkets(mintToken: PublicKey, marketStatus: MarketStatus){
    const program = await getProgram()
    const response = await getMarketAccountsByStatusAndMintAccount(program, marketStatus, mintToken)
    logResponse(response)
}

// The Monaco Protocol example token: Aqw6KyChFm2jwAFND3K29QjUcKZ3Pk72ePe5oMxomwMH
const processArgs = getProcessArgs(["mintToken", "marketStatus"], "npm run getMarketsByMintToken")
const mintToken = new PublicKey(processArgs.mintToken)
const marketStatus = marketStatusFromString(processArgs.marketStatus)
getMarkets(mintToken, marketStatus)
