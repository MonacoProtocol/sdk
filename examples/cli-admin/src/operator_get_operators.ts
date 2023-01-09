import {
  getOperatorsAccountByType,
  Operator
} from "@monaco-protocol/admin-client";
import {
  getProgram,
  getProcessArgs,
  operatorTypeFromString,
  logResponse
} from "./utils";

async function getOperators(operatorType: Operator) {
  const program = await getProgram();
  const response = await getOperatorsAccountByType(program, operatorType);
  logResponse(response);
}

const args = getProcessArgs(["operatorType"], "npm run getOperatorsByType");
getOperators(operatorTypeFromString(args.operatorType));
