import { getMarketPrices } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, logJson, log, getProcessArgs} from "./utils";

async function getMarketPricesByPk(marketPk: PublicKey){
    const program = await getProgram()
    const markets = await getMarketPrices(program, marketPk)
    if (!markets.success){
        log(markets.errors)
    }
    else{
        logJson(markets)
    }
}

const processArgs = getProcessArgs(["marketPk"], "npm run getMarketPrices")
const marketPk = new PublicKey(processArgs.marketPk)
getMarketPricesByPk(marketPk)
