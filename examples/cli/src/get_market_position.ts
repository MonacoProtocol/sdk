import { getMarketPosition } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logResponse } from "./utils";
import { AnchorProvider } from "@coral-xyz/anchor";
import { parseResponseData } from "./parsers/parsers";

async function getMarketPositionForProvider(marketPk: PublicKey) {
  const program = await getProgram();
  const provider = program.provider as AnchorProvider;
  const response = await getMarketPosition(
    program,
    marketPk,
    provider.wallet.publicKey
  );
  response.data = parseResponseData(response.data)
  logResponse(response);
}

const args = getProcessArgs(["marketPk"], "npm run getMarketPosition");
getMarketPositionForProvider(new PublicKey(args.marketPk));
