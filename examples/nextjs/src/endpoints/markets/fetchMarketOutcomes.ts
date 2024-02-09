import { Program } from '@coral-xyz/anchor';
import { getMarketOutcomesByMarket } from '@monaco-protocol/client';
import { PublicKey } from '@solana/web3.js';

import db from '@/database/database';
import {
  getLastFetchTimestamp,
  getLocalMarketOutcomesByMarket,
  updateFetchTime,
} from '@/database/endpoints/database';
import { IMarketOutcome } from '@/database/types';
import { parseResponseData } from '@/utils/parsers';
import { getStoredSettings } from '@/utils/settings';
import { hasElapsed } from '@/utils/time';

const CACHE_DURATION_MINUTES = getStoredSettings().active.cache_market_outcomes;

export const fetchMarketOutcomes = async (program: Program, marketPublicKey: string) => {
  const cache = await checkCache(marketPublicKey.toString());
  if (cache) return cache;
  try {
    const marketOutcomesData = await getMarketOutcomesByMarket(
      program,
      new PublicKey(marketPublicKey),
    );
    if (marketOutcomesData.success) {
      parseResponseData(marketOutcomesData.data);

      const outcomesToStorePromises = marketOutcomesData.data.marketOutcomeAccounts.map(
        (marketOutcome) =>
          db.marketOutcomes.put({
            publicKey: marketOutcome.publicKey.toString(),
            market: marketOutcome.account.market.toString(),
            index: marketOutcome.account.index,
            title: marketOutcome.account.title,
            latestMatchedPrice: marketOutcome.account.latestMatchedPrice,
            matchedTotal: marketOutcome.account.matchedTotal,
          }),
        updateFetchTime(`marketOutcomes-${marketPublicKey.toString()}`),
      );

      await Promise.all(outcomesToStorePromises);
      return getLocalMarketOutcomesByMarket(marketPublicKey.toString());
    } else {
      console.log(marketOutcomesData.errors);
      throw new Error(`Error returned from fetchMarketOutcomes endpoint`);
    }
  } catch (error) {
    console.error('Error fetching market outcomes:', error);
  }
};

export const fetchMarketOutcomesForMarkets = async (
  program: Program,
  marketPublicKeys: string[],
): Promise<IMarketOutcome[]> => {
  const marketOutcomes = [];
  for (const marketPublicKey of marketPublicKeys) {
    try {
      const outcomes = await fetchMarketOutcomes(program, marketPublicKey);
      if (outcomes) marketOutcomes.push(...outcomes);
    } catch (error) {
      console.error('Error fetching market outcomes:', error);
    }
  }
  return marketOutcomes;
};

const checkCache = async (marketPublicKey: string) => {
  const lastUpdate = await getLastFetchTimestamp(`marketOutcomes-${marketPublicKey}`);
  const outcomes = await getLocalMarketOutcomesByMarket(marketPublicKey);
  if (
    lastUpdate &&
    !hasElapsed(lastUpdate, CACHE_DURATION_MINUTES) &&
    Object.keys(outcomes).length > 0
  ) {
    console.log(`Last update was less than ${CACHE_DURATION_MINUTES} mins ago`);
    return outcomes;
  }
};
