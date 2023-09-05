import {
  findEscrowPda,
  getMarketPrices,
  getMintInfo,
  MarketOutcomeAccount,
  MarketPrice
} from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { mapPricesToOutcomesAndForAgainst } from "../mappers/market_price_mapper";
import { mapOrdersToOutcomesAndForAgainst } from "../mappers/order_mapper";
import { getProgram, getProcessArgs, logJson } from "../utils/utils";
import { AnchorProvider } from "@coral-xyz/anchor";
import { parseResponseData } from "../parsers/parsers";

async function getMarketSummary(marketPk: PublicKey) {
  const program = await getProgram();
  const provider = program.provider as AnchorProvider
  const escrowPda = await findEscrowPda(program, marketPk)
  const [marketPrices, escrow] = await Promise.all([
    getMarketPrices(program, marketPk),
    provider.connection.getParsedAccountInfo(escrowPda.data.pda)
  ])
  const mintDetails = await getMintInfo(
    program,
    marketPrices.data.market.mintAccount
  );
  const parsedMarketPrices = parseResponseData(marketPrices.data, mintDetails.data.decimals);
  const marketOutcomeAccounts = parsedMarketPrices.marketOutcomeAccounts.map(
    (marketOutcomeAccount) => {
      return marketOutcomeAccount.account;
    }
  );
  const matchedTotal = matchedTotalFromParsedOutcomeAccounts(
    marketOutcomeAccounts
  );
  const liquidityTotal = liquidityTotalFromParsedMarketPrices(
    parsedMarketPrices.marketPrices
  );
  const marketOutcomesSummary = parsedMarketPrices.marketOutcomeAccounts.map(
    (outcome) => {
      return {
        outcome: outcome.account.title,
        latestMatchedPrice: outcome.account.latestMatchedPrice,
        matchedTotal: outcome.account.matchedTotal
      };
    }
  );

  const outcomeTitles = marketOutcomeAccounts.map((outcome) => {
    return outcome.title;
  });
  const pendingOrders = parsedMarketPrices.pendingOrders.map((order) => {
    return order.account;
  });

  const pendingOrderSummary = mapOrdersToOutcomesAndForAgainst(
    outcomeTitles,
    pendingOrders
  );
  const marketPriceSummary = mapPricesToOutcomesAndForAgainst(
    outcomeTitles,
    parsedMarketPrices.marketPrices
  );

  logJson({
    pendingOrderSummary: pendingOrderSummary,
    marketPriceSummary: marketPriceSummary,
    marketOutcomesSummary: marketOutcomesSummary,
    marketTitle: parsedMarketPrices.market.title,
    marketLock: new Date(parsedMarketPrices.market.marketLockTimestamp * 1000),
    liquidityTotal: liquidityTotal,
    matchedTotal: matchedTotal,
    totalUnmatchedOrders: parsedMarketPrices.pendingOrders.length,
    totalInEscrow: escrow.value.data['parsed']['info']['tokenAmount']['uiAmount'],
  });
}

function matchedTotalFromParsedOutcomeAccounts(
  marketOutcomeAccounts: MarketOutcomeAccount[]
) {
  let marketMatchedTotal = 0;
  marketOutcomeAccounts.map((marketOutcome) => {
    marketMatchedTotal += marketOutcome.matchedTotal;
  });
  return marketMatchedTotal;
}

function liquidityTotalFromParsedMarketPrices(marketPrices: MarketPrice[]) {
  let marketLiquidity = 0;
  marketPrices.map((marketPrice) => {
    marketLiquidity += marketPrice.matchingPool.liquidityAmount;
  });
  return marketLiquidity;
}

const args = getProcessArgs(["marketPk"], "npm run getMarketSummary");
getMarketSummary(new PublicKey(args.marketPk));
