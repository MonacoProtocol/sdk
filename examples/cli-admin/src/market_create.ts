import { PublicKey, Keypair } from "@solana/web3.js";
import {
  createMarketWithOutcomesAndPriceLadder,
  MarketType,
  DEFAULT_PRICE_LADDER,
  checkOperatorRoles
} from "@monaco-protocol/admin-client";
import { getProgram, log, getProcessArgs, logResponse } from "./utils";

async function createMarket(mintToken: PublicKey) {
  const program = await getProgram();
  const checkRoles = await checkOperatorRoles(
    program,
    program.provider.publicKey
  );

  if (!checkRoles.data.market)
    throw new Error(
      `Currently set wallet ${program.provider.publicKey} does not have the operator role`
    );

  // Generate a publicKey to represent the event
  const eventAccountKeyPair = Keypair.generate();
  const eventPk = eventAccountKeyPair.publicKey;

  const marketName = "Example Market";
  const type = MarketType.EventResultWinner;
  const marketLock = 32503680000;
  const outcomes = ["Red", "Blue"];
  const priceLadder = DEFAULT_PRICE_LADDER;
  const batchSize = 40;

  const response = await createMarketWithOutcomesAndPriceLadder(
    program,
    marketName,
    type,
    mintToken,
    marketLock,
    eventPk,
    outcomes,
    priceLadder,
    batchSize
  );
  logResponse(response);
  if (response.success) {
    log(`MarketAccount: ${response.data.marketPk.toString()}`);
    log(`TransactionId: ${response.data.tnxId}`);
  }
}

const args = getProcessArgs(["mintToken"], "npm run createMarket");
createMarket(new PublicKey(args.mintToken));
