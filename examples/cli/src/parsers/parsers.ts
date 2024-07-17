import { BN } from "@coral-xyz/anchor";

export function parseResponseData(
  responseData: any,
  mintDecimals = 0,
  bnKeys: string[] = bigNumberKeys,
  bnMintKeys: string[] = bigNumberMintKeys,
  bnMintArrays: string[] = bigNumberMintArrays
): any {
  if (!responseData) return responseData;
  for (const [key, value] of Object.entries(responseData)) {
    if (value === null || value === undefined) {
      // no op
    } else if (bnKeys.includes(key)) {
      const timestamp = value as BN;
      responseData[key] = timestamp.toNumber();
    } else if (bnMintKeys.includes(key)) {
      const mintValue = value as BN;
      if (mintDecimals) {
        responseData[key] = integerToUiValue(mintValue, mintDecimals);
      } else {
        responseData[key] = mintValue.toNumber();
      }
    } else if (bnMintArrays.includes(key)) {
      for (const rawValue of value as []) {
        const index = responseData[key].indexOf(rawValue);
        const mintValue = rawValue as BN;
        if (mintDecimals) {
          responseData[key][index] = integerToUiValue(mintValue, mintDecimals);
        } else {
          responseData[key][index] = mintValue.toNumber();
        }
      }
    } else if (typeof value === "object") {
      responseData[key] = parseResponseData(value, mintDecimals);
    }
  }
  return responseData;
}

export function integerToUiValue(integerValue: BN, mintDecimals: number) {
  return integerValue.toNumber() / 10 ** mintDecimals;
}

const emptyOrderString = "11111111111111111111111111111111";

/** All data keys for BNs */
export const bigNumberKeys = [
  "marketLockTimestamp",
  "marketSettleTimestamp",
  "eventStartTimestamp",
  "creationTimestamp",
  "delayExpirationTimestamp"
];

/** All data keys for BNs returning mint values */
export const bigNumberMintKeys = [
  "payout",
  "stake",
  "stakeUnmatched",
  "voidedStake",
  "matchedTotal",
  "liquidityAmount",
  "matchedAmount",
  "liquidityToAdd",
  "matchedRisk",
  "risk"
];

/** All data keys for BNs returning mint values in an array */
export const bigNumberMintArrays = ["marketOutcomeSums", "unmatchedExposures"];
