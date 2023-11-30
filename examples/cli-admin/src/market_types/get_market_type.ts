
import { findMarketTypePda } from "@monaco-protocol/admin-client";
import { getProgram, getProcessArgs } from "../utils";

async function getMarketTypes(marketTypeName: string) {
  const program = await getProgram();
  const pda = findMarketTypePda(program, marketTypeName);
  const response = await program.account.marketType.fetch(pda.data.pda);
  console.log(JSON.stringify(response, null, 3));
}

const args = getProcessArgs(["marketTypeName"], "npm run getMarketType");
getMarketTypes(args.marketTypeName);
