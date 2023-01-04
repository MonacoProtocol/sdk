import { PublicKey, Keypair } from "@solana/web3.js";
import { createMarket, MarketType, DEFAULT_PRICE_LADDER, initialiseOutcomes, batchAddPricesToAllOutcomePools, addPricesToOutcome } from "@monaco-protocol/admin-client"
import { getProgram, log, getProcessArgs, logResponse } from "./utils";

async function createVerboseMarket(mintToken: PublicKey){
    const program = await getProgram()
    // Generate a publicKey to represent the event
    const eventAccountKeyPair = Keypair.generate();
    const eventPk = eventAccountKeyPair.publicKey;
    
    const marketName = "Example Market";
    const type = MarketType.EventResultWinner;
    const marketLock = 32503680000;
    const outcomes = ["Red", "Blue"];
    const priceLadder = DEFAULT_PRICE_LADDER;
    const batchSize = 40;

    log(`Creating market ⏱`)
    const marketResponse = await createMarket(
        program,
        marketName,
        type,
        mintToken,
        marketLock,
        eventPk
    )
    logResponse(marketResponse)
    if (marketResponse.success) log(`Market ${marketResponse.data.marketPk.toString()} created ✅`)
    else return

    const marketPk = marketResponse.data.marketPk

    log(`Initialising market outcomes ⏱`)
    const initialiseOutcomePoolsResponse = await initialiseOutcomes(
        program,
        marketPk,
        outcomes
    )

    logResponse(initialiseOutcomePoolsResponse)
    if (initialiseOutcomePoolsResponse.success) log(`Outcomes added to market ✅`)
    else return

    log(`Adding prices to outcomes ⏱`)
    const addPriceLaddersResponse = await batchAddPricesToAllOutcomePools(
        program,
        marketPk,
        priceLadder,
        batchSize
    )

    logResponse(addPriceLaddersResponse)
    if (addPriceLaddersResponse.success) log(`Prices added to outcomes ✅`)
    else return

    log(`Market ${marketPk.toString()} creation complete ✨`)
}

const args = getProcessArgs(["mintToken"], "npm run createMarketVerbose")
createVerboseMarket(new PublicKey(args.mintToken))
