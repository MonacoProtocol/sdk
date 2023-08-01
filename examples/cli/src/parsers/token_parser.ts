import { BN } from "@coral-xyz/anchor";

export function parseTokenAmountBN(tokenAmount: BN, mintDecimals: number) {
  return tokenAmount.toNumber() / 10 ** mintDecimals;
}
