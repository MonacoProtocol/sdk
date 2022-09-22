import { getProgram, logJson, log } from "./utils";
import { authoriseMarketOperator } from "@betdexlabs/betdex-internal-admin-client"

async function addRole(){
    const program = await getProgram()
    const response = await authoriseMarketOperator(program, program.provider.publicKey)
    if (!response.success){
        log(response.errors)
    }
    else{
        logJson(response)
    }
}

addRole()
