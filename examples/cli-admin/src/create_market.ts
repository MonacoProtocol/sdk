import { getProgram, logJson, log } from "./utils";
import { PublicKey, Keypair } from "@solana/web3.js";
import { createMarketWithOutcomesAndPriceLadder } from "@betdexlabs/betdex-internal-admin-client"
import { MarketType, DEFAULT_PRICE_LADDER} from "@betdexlabs/betdex-internal-admin-client"


async function createMarket(){
    const program = await getProgram()
    // Update for WINS
    const mintToken = new PublicKey("2QqxXa2aNCx3DLQCHgiC4P7Xfbe3B4bULM5eKpyAirGY")
    // Generate a publicKey to represent the event
    const eventAccountKeyPair = Keypair.generate();

    const response = await createMarketWithOutcomesAndPriceLadder(
        program,
        "Example Market",
        MarketType.EventResultFullTime,
        mintToken,
        1924254038,
        eventAccountKeyPair.publicKey,
        ["Team A", "Draw", "Team B"],
        DEFAULT_PRICE_LADDER,
        50
        )
    if (!response.success){
        log(response.errors)
    }
    else{
        logJson(response.data.priceLadderResults)
        logJson(response.data.market)
        log(`MarketAccount: ${response.data.marketPk.toString()}`)
        log(`TransactionId: ${response.data.tnxId}`)
    }
}

createMarket()
