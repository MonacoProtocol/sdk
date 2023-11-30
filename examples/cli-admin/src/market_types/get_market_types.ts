
import { getProgram, getProcessArgs } from "../utils";

async function getMarketTypes() {
  const program = await getProgram();
  const response = await program.account.marketType.all();
  console.log(JSON.stringify(response, null, 3));
}

getProcessArgs([], "npm run getMarketTypes");
getMarketTypes();
