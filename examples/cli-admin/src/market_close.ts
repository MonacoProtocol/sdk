import { setMarketReadyToClose } from "@monaco-protocol/admin-client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "./utils";

async function closeMarket(marketPk: PublicKey) {
  const program = await getProgram();
  const response = await setMarketReadyToClose(program, marketPk);
  logResponse(response);
}

const args = getProcessArgs(["marketPk"], "npm run closeMarket");
closeMarket(new PublicKey(args.marketPk));
