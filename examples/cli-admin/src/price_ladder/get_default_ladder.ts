import { findPriceLadderPda } from "@monaco-protocol/admin-client";
import { getProgram, getProcessArgs } from "../utils";

async function getLadder() {
  const program = await getProgram();
  const pda = findPriceLadderPda(program, 'DEFAULT_PRICE_LADDER');
  const response = await program.account.priceLadder.fetch(pda.data.pda);
  console.log(JSON.stringify(response));
}

getProcessArgs([], "npm run getDefaultLadder");
getLadder();

