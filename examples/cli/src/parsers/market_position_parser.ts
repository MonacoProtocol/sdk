import { MarketPosition } from "@monaco-protocol/client";
import { parseTokenAmountBN } from "./token_parser";

export function parseMarketPosition(marketPosition: MarketPosition, mintDecimals: number) {
  marketPosition.marketOutcomeSums.forEach((outcomeSum, index) => {
    marketPosition.marketOutcomeSums[index] = parseTokenAmountBN(
      outcomeSum,
      mintDecimals
    );
  });
  marketPosition.unmatchedExposures.forEach((outcomeMaxExposure, index) => {
    marketPosition.unmatchedExposures[index] = parseTokenAmountBN(
      outcomeMaxExposure,
      mintDecimals
    );
  });
  return marketPosition;
}
