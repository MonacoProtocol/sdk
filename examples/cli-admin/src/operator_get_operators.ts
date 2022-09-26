import { getOperatorsAccountByType, Operator } from "@monaco-protocol/admin-client"
import { getProgram, getProcessArgs, operatorTypeFromString, logResponse } from "./utils";

async function getOperators(operatorType: Operator){
    const program = await getProgram()
    const response = await getOperatorsAccountByType(program, operatorType)
    logResponse(response)
}

const processArgs = getProcessArgs(["operatorType"], "npm run getOperatorsByType")
const operatorType = operatorTypeFromString(processArgs.operatorType)
getOperators(operatorType)
