
import { getProgram, getProcessArgs } from "../utils";
import { PublicKey } from "@solana/web3.js";

async function getMarketType(publicKey: PublicKey) {
  const program = await getProgram();
  const response = await program.account.marketType.fetch(publicKey);
  console.log(JSON.stringify(response, null, 3));
}

const args = getProcessArgs(["marketTypePk"], "npm run getMarketTypeByPk");
getMarketType(new PublicKey(args.marketTypePk));
