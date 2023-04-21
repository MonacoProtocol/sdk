import { MarketPosition } from "@monaco-protocol/client";
import { parseTokenAmountBN } from "./token_parser";

export function parseMarketPosition(marketPosition: MarketPosition, mintDecimals: number) {
  marketPosition.marketOutcomeSums.forEach((outcomeSum, index) => {
    marketPosition.marketOutcomeSums[index] = parseTokenAmountBN(
      outcomeSum,
      mintDecimals
    );
  });
  marketPosition.outcomeMaxExposure.forEach((outcomeMaxExposure, index) => {
    marketPosition.outcomeMaxExposure[index] = parseTokenAmountBN(
      outcomeMaxExposure,
      mintDecimals
    );
  });
  return marketPosition;
}
