import {
  ComputeBudgetProgram,
  PublicKey,
  TransactionInstruction
} from "@solana/web3.js";
import {
  ClientResponse,
  ResponseFactory,
  SignAndSendInstructionsResponse,
  buildOrderInstructionUIStake,
  confirmTransaction,
  getMarketOutcomesByMarket
} from "@monaco-protocol/client";
import {
  getProgram,
  getProcessArgs,
  logResponse,
  SDK_PRODUCT,
  log
} from "../utils/utils";
import { AnchorProvider, Program, web3 } from "@coral-xyz/anchor";

type TransactionOptions = {
  computeUnitLimit?: number;
  computeUnitPrice?: number;
};

async function signAndSendInstructions(
  program: Program,
  instructions: TransactionInstruction[],
  options?: TransactionOptions
): Promise<ClientResponse<SignAndSendInstructionsResponse>> {
  const response = new ResponseFactory({} as SignAndSendInstructionsResponse);
  const provider = program.provider as AnchorProvider;

  const transaction = new web3.Transaction();
  if (options?.computeUnitLimit) {
    transaction.add(
      ComputeBudgetProgram.setComputeUnitLimit({
        units: options.computeUnitLimit
      })
    );
  }
  if (options?.computeUnitPrice) {
    transaction.add(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: options.computeUnitPrice
      })
    );
  }
  instructions.forEach((instruction) => transaction.add(instruction));
  transaction.feePayer = provider.wallet.publicKey;
  transaction.recentBlockhash = (
    await provider.connection.getLatestBlockhash()
  ).blockhash;
  try {
    const signature = await provider.connection.sendRawTransaction(
      (await provider.wallet.signTransaction(transaction)).serialize()
    );
    response.addResponseData({ signature });
  } catch (e) {
    response.addError(e);
  }
  return response.body;
}

async function placeOrderWithFees(
  marketPk: PublicKey,
  forOutcome: boolean = true
) {
  const program = await getProgram();
  const marketOutcomeIndex = 0;
  const price = 2;
  const stake = 1;
  const market = await getMarketOutcomesByMarket(program, marketPk);
  const instruction = await buildOrderInstructionUIStake(
    program,
    marketPk,
    marketOutcomeIndex,
    forOutcome,
    price,
    stake,
    market.data.marketOutcomeAccounts[marketOutcomeIndex].account.prices,
    SDK_PRODUCT
  );
  const options = {
    computeUnitLimit: 150000,
    computeUnitPrice: 10000
  };
  const transaction = await signAndSendInstructions(
    program,
    [instruction.data.instruction],
    options
  );
  const confirm = await confirmTransaction(program, transaction.data.signature);
  logResponse(transaction);
  log(`orderPk: ${instruction.data.orderPk.toString()}`);
  if (!confirm.success) {
    console.log(confirm.errors[0]);
  }
}

const args = getProcessArgs(["marketPk"], "npm run placeOrderWithFees");
placeOrderWithFees(new PublicKey(args.marketPk));
