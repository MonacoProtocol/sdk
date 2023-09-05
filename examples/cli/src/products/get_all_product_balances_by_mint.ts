import { Products } from "@monaco-protocol/client";
import { getProgram, getProcessArgs, ProtocolTypes, log } from "../utils/utils";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

async function getBalances(mintPk: PublicKey) {
  const allowOwnerOffCurve = true;
  const program = await getProgram(ProtocolTypes.MONACO_PRODUCT);
  const response = await Products.productQuery(program).fetch();
  const uniqueEscrowAccounts = [...new Set(response.data.productAccounts.map(product => product.account.commissionEscrow.toBase58()))]
  log(`${'*'.repeat(75)}`)
  uniqueEscrowAccounts.map(async (escrowAccount) => {
    try {
      const tokenAccount = await getAssociatedTokenAddress(mintPk, new PublicKey(escrowAccount), allowOwnerOffCurve)
      const balance = await program.provider.connection.getTokenAccountBalance(tokenAccount)
      log(`Products: ${response.data.productAccounts.filter((product) => product.account.commissionEscrow.toBase58() === escrowAccount).map((product) => product.account.productTitle).join(', ')}`)
      log(`Escrow Account: ${escrowAccount}`)
      log(`Balance: ${balance.value.uiAmountString}`)
      log(`${'*'.repeat(75)}`)
    }
    catch {
      log(`Unable to get balance for ${escrowAccount}`)
      log(`${'*'.repeat(75)}`)
    }
  })
}

const args = getProcessArgs(["mintPk"], "npm run getProductEscrowValues");
getBalances(new PublicKey(args.mintPk));
