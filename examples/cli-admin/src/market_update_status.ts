import { PublicKey } from "@solana/web3.js";
import { publishMarket, unpublishMarket, suspendMarket, unsuspendMarket } from "@betdexlabs/betdex-internal-admin-client"
import { getProgram, logResponse, getProcessArgs } from "./utils";

async function updateStatus(marketPk: PublicKey, status: string){
    const program = await getProgram()
    let response
    try {
        switch (status){
            case "publish":
                response = await publishMarket(program, marketPk)
                logResponse(response)
                break
            case "unpublish":
                response = await unpublishMarket(program, marketPk)
                logResponse(response)
                break
            case "suspend":
                response = await suspendMarket(program, marketPk)
                logResponse(response)
                break
            case "unsuspend":
                response = await unsuspendMarket(program, marketPk)
                logResponse(response)
                break
            default:
                throw "Invalid status supplied. Available statuses: publish, unpublish, suspend, unsuspend"
        }
    }
    catch(e){
        console.log(e)
    }
}

const processArgs = getProcessArgs(["marketPk", "status"], "npm run updateMarketStatus")
const marketPk = new PublicKey(processArgs.marketPk)
const status = processArgs.status
updateStatus(marketPk, status)
