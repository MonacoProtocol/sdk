import { parseTokenAmountBN } from "./token_parser";

export function parseMarketPosition(marketPosition, mintDecimals: number) {
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
  marketPosition.offset = parseTokenAmountBN(
    marketPosition.offset,
    mintDecimals
  );
  return marketPosition;
}
