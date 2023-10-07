import { PublicKey, Keypair } from "@solana/web3.js";
import {
  createMarket,
  initialiseOutcomes,
  checkOperatorRoles
} from "@monaco-protocol/admin-client";
import { getProgram, log, getProcessArgs, logResponse, FULL_PRICE_LADDER_ACCOUNT } from "./utils";

async function createVerboseMarket(mintToken: PublicKey) {
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
  const marketLock = 32503680000;
  const outcomes = ["Red", "Blue"];

  log(`Creating market ⏱`);
  const marketResponse = await createMarket(
    program,
    marketName,
    'SDK_WINNER',
    '',
    '',
    mintToken,
    marketLock,
    eventPk
  );
  logResponse(marketResponse);
  if (marketResponse.success)
    log(`Market ${marketResponse.data.marketPk.toString()} created ✅`);
  else return;

  const marketPk = marketResponse.data.marketPk;

  log(`Initialising market outcomes ⏱`);
  const initialiseOutcomePoolsResponse = await initialiseOutcomes(
    program,
    marketPk,
    outcomes,
    FULL_PRICE_LADDER_ACCOUNT
  );

  logResponse(initialiseOutcomePoolsResponse);
  if (initialiseOutcomePoolsResponse.success)
    log(`Outcomes added to market ✅`);
  else return;

  log(`Market ${marketPk.toString()} creation complete ✨`);
}

const args = getProcessArgs(["mintToken"], "npm run createMarket");
createVerboseMarket(new PublicKey(args.mintToken));
