import { checkOperatorRoles } from "@monaco-protocol/admin-client";
import { getProgram, getProcessArgs, logResponse } from "./utils";

async function checkRoles() {
  const program = await getProgram();
  const response = await checkOperatorRoles(
    program,
    program.provider.publicKey
  );
  logResponse(response);
}

getProcessArgs([], "npm run checkRoles");
checkRoles();
