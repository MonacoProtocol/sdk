import { PublicKey } from "@solana/web3.js";
import { authoriseMarketOperator } from "@monaco-protocol/admin-client"
import { getProgram, getProcessArgs, logResponse } from "./utils";

async function addRole(newOperatorPk: PublicKey){
    const program = await getProgram()
    const response = await authoriseMarketOperator(program, newOperatorPk)
    logResponse(response)
}

const processArgs = getProcessArgs(["newOperatorPk"], "npm run addMarketOperator")
const newOperatorPk = new PublicKey(processArgs.newOperatorPk)
addRole(newOperatorPk)
