import {
  findMarketLiquiditiesPda,
  getMarket,
  getMarketLiquidities,
  getMarketOutcomesByMarket,
  getMintInfo,
  MarketLiquidities,
} from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs, logJson } from "../utils/utils";
import { AnchorProvider } from "@coral-xyz/anchor";
import { integerToUiValue } from "../parsers/parsers";

async function getMarketSummary(marketPk: PublicKey) {
  const program = await getProgram();
  const provider = program.provider as AnchorProvider;
  const liquiditiesPda = await findMarketLiquiditiesPda(program, marketPk);
  const [marketLiquidity, market, marketOutcomes] = await Promise.all([
    getMarketLiquidities(program, liquiditiesPda.data.pda),
    getMarket(program, marketPk),
    getMarketOutcomesByMarket(program, marketPk),
  ]);
  const mintDetails = await getMintInfo(
    program,
    market.data.account.mintAccount
  );

  const outcomeTitles = marketOutcomes.data.marketOutcomeAccounts.map((outcome) => {
    return outcome.account.title;
  });

  const prices = marketPrices(marketLiquidity.data.account, outcomeTitles, mintDetails.data.decimals);
  const priceMatrix = generatePriceMatrix(prices);

  logJson({
    marketTitle: market.data.account.title,
    marketLock: new Date(market.data.account.marketLockTimestamp * 1000).toUTCString(),
    liquidityTotal: liquidityTotal(marketLiquidity.data.account, mintDetails.data.decimals),
    matchedTotal: integerToUiValue(marketLiquidity.data.account.stakeMatchedTotal, mintDetails.data.decimals),
  });

  console.table(priceMatrix);
}

function liquidityTotal(marketLiquidity: MarketLiquidities, mintDecimals: number) {
  let liquidityTotal = 0;
  for (const liquidity of marketLiquidity.liquiditiesFor) {
    liquidityTotal += liquidity.liquidity.toNumber();
  }
  for (const liquidity of marketLiquidity.liquiditiesAgainst) {
    liquidityTotal += liquidity.liquidity.toNumber();
  }
  return liquidityTotal / 10 ** mintDecimals;
};

type MarketPrices = {
  [outcomeTitle: string]: {
    for: { price: number; liquidity: number }[];
    against: { price: number; liquidity: number }[];
  };
};

type PriceMatrix = {
  outcome: string;
  for3: string;
  for2: string;
  for1: string;
  against1: string;
  against2: string;
  against3:string;
};

function marketPrices(marketLiquidity: MarketLiquidities, outcomeTitles: string[], mintDecimals: number): MarketPrices {
  const prices = {};

  outcomeTitles.forEach((title, index) => {
    const liquiditiesFor = marketLiquidity.liquiditiesFor.filter((liquidity) => liquidity.outcome === index) ?? [];
    const liquiditiesAgainst = marketLiquidity.liquiditiesAgainst.filter((liquidity) => liquidity.outcome === index) ?? [];

    prices[title] = {
      for: liquiditiesFor.map((liquidityFor) => ({
        price: liquidityFor.price,
        liquidity: integerToUiValue(liquidityFor.liquidity, mintDecimals),
      })),
      against: liquiditiesAgainst.map((liquidityAgainst) => ({
        price: liquidityAgainst.price,
        liquidity: integerToUiValue(liquidityAgainst.liquidity, mintDecimals),
      })),
    };
  });

  return prices;
}

function generatePriceMatrix(marketPrices: MarketPrices): PriceMatrix[] {
  return Object.entries(marketPrices).map(([outcomeTitle, prices]) => {
    const sortedForPrices = prices.for.sort((a, b) => a.price - b.price);
    const sortedAgainstPrices = prices.against.sort((a, b) => a.price - b.price);

    const getPrice = (arr: { price: number; liquidity: number }[], index: number) => {
      const price = arr[index] ?? { price: 0, liquidity: 0 };
      return price.price ? `${price.price} ($${price.liquidity})` : '-';
    };

    return {
      outcome: outcomeTitle,
      for3: getPrice(sortedAgainstPrices, 2),
      for2: getPrice(sortedAgainstPrices, 1),
      for1: getPrice(sortedAgainstPrices, 0),
      against1: getPrice(sortedForPrices, 0),
      against2: getPrice(sortedForPrices, 1),
      against3: getPrice(sortedForPrices, 2),
    };
  });
}

const args = getProcessArgs(["marketPk"], "npm run getMarketSummary");
getMarketSummary(new PublicKey(args.marketPk));
