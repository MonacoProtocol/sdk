import { PublicKey, Keypair } from "@solana/web3.js";
import { createMarketWithOutcomesAndPriceLadder, MarketType, DEFAULT_PRICE_LADDER } from "@monaco-protocol/admin-client"
import { getProgram, log, getProcessArgs, logResponse } from "./utils";

async function createMarket(mintToken: PublicKey){
    const program = await getProgram()
    // Generate a publicKey to represent the event
    const eventAccountKeyPair = Keypair.generate();

    const response = await createMarketWithOutcomesAndPriceLadder(
        program,
        "Example Market",
        MarketType.EventResultWinner,
        mintToken,
        32503680000,
        eventAccountKeyPair.publicKey,
        ["Red", "Blue"],
        DEFAULT_PRICE_LADDER,
        40
        )
    logResponse(response)
    if (response.success){
        log(`MarketAccount: ${response.data.marketPk.toString()}`)
        log(`TransactionId: ${response.data.tnxId}`)
    }
}

const processArgs = getProcessArgs(["mintToken"], "npm run createMarket")
const mintToken = new PublicKey(processArgs.mintToken)
createMarket(mintToken)
