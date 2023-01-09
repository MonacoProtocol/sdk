import { MarketPrice } from "@monaco-protocol/client";
import { parseTokenAmountBN } from "./token_parser";

export function parseMarketPrice(
  marketPrice: MarketPrice,
  mintDecimals: number,
  onlyShowOrdersInQueue: boolean = true
) {
  const parsedMarketPrices = marketPrice;
  parsedMarketPrices.matchingPool.liquidityAmount = parseTokenAmountBN(
    parsedMarketPrices.matchingPool.liquidityAmount,
    mintDecimals
  );
  parsedMarketPrices.matchingPool.matchedAmount = parseTokenAmountBN(
    parsedMarketPrices.matchingPool.matchedAmount,
    mintDecimals
  );
  if (onlyShowOrdersInQueue)
    parsedMarketPrices.matchingPool.orders.items =
      parsedMarketPrices.matchingPool.orders.items.filter(
        (order) => order.toString() != "11111111111111111111111111111111"
      );
  return parsedMarketPrices;
}
