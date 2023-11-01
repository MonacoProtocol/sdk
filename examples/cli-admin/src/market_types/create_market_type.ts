import { getOrCreateMarketType } from "@monaco-protocol/admin-client";
import { getProgram, getProcessArgs, logResponse } from "../utils";

async function marketType() {
  const program = await getProgram();
  const marketTypeName = 'SDK_WINNER'
  const requiresDiscriminator = false;
  const requiresValue = false;
  const response = await getOrCreateMarketType(program, marketTypeName, requiresDiscriminator, requiresValue);
  logResponse(response);
}

getProcessArgs([], "npm run createMarketType");
marketType();
