import { getProgram, logJson, log } from "./utils";
import { checkOperatorRoles } from "@betdexlabs/betdex-internal-admin-client"

async function checkRoles(){
    const program = await getProgram()
    const response = await checkOperatorRoles(program, program.provider.publicKey)
    if (!response.success){
        log(response.errors)
    }
    else{
        logJson(response)
    }
}

checkRoles()
