import { BN } from '@coral-xyz/anchor';
import {
  MarketMatchingPoolsWithSeeds,
  MarketPrice,
  MarketStatus,
  OrderStatus,
} from '@monaco-protocol/client';
import { PublicKey } from '@solana/web3.js';

import { DEFAULT_MINT_DECIMALS } from '@/config/appSettings';
import { MappedMarketStatus } from '@/const/markets';
import { MappedOrderStatus } from '@/const/orders';

import { nowTimestamp } from './time';

export function parseResponseData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responseData: any,
  bnKeys: string[] = bigNumberKeys,
  bnMintKeys: string[] = bigNumberMintKeys,
  bnMintArrays: string[] = bigNumberMintArrays,
): unknown {
  const mintDecimals = DEFAULT_MINT_DECIMALS;
  for (const [key, value] of Object.entries(responseData)) {
    if (value === null || value === undefined) {
      // no op
    } else if (publicKeys.includes(key)) {
      const publicKey = value as PublicKey;
      responseData[key] = publicKey.toString();
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
    } else if (key === 'orderStatus') {
      responseData[key] = parseOrderStatus(value, responseData.stakeUnmatched);
    } else if (key === 'marketStatus') {
      responseData[key] = parseMarketStatus(
        value,
        responseData.inplayEnabled,
        responseData.inplay,
        responseData.marketLockTimestamp.toNumber(),
      );
    } else if (typeof value === 'object') {
      responseData[key] = parseResponseData(value);
    }
  }
  return responseData;
}

export function parseEmptyQueueItemsFromMatchingPoolAccounts(
  marketMatchingPoolAccounts: MarketMatchingPoolsWithSeeds,
): MarketMatchingPoolsWithSeeds {
  marketMatchingPoolAccounts.marketMatchingPoolsWithSeeds.forEach((marketMatchingPool) => {
    marketMatchingPool.account.marketMatchingPool.orders.items =
      marketMatchingPool.account.marketMatchingPool.orders.items.filter(
        (item) => item.order.toString() != emptyOrderString,
      );
  });
  return marketMatchingPoolAccounts;
}

export function parseEmptyQueueItemsFromMarketPrices(marketPrices: MarketPrice[]): MarketPrice[] {
  marketPrices.forEach((marketPrice) => {
    marketPrice.matchingPool.orders.items = marketPrice.matchingPool.orders.items.filter(
      (item) => item.order.toString() != emptyOrderString,
    );
  });
  return marketPrices;
}

export function integerToUiValue(integerValue: BN, mintDecimals: number) {
  return integerValue.toNumber() / 10 ** mintDecimals;
}

const emptyOrderString = '11111111111111111111111111111111';

/** All data keys for BNs */
const bigNumberKeys = [
  'marketLockTimestamp',
  'marketSettleTimestamp',
  'eventStartTimestamp',
  'creationTimestamp',
  'delayExpirationTimestamp',
];

const publicKeys = ['publicKey', 'market', 'purchaser', 'payer', 'product', 'eventAccount'];

/** All data keys for BNs returning mint values */
const bigNumberMintKeys = [
  'payout',
  'stake',
  'stakeUnmatched',
  'voidedStake',
  'matchedTotal',
  'liquidityAmount',
  'matchedAmount',
  'liquidityToAdd',
  'matchedRisk',
  'risk',
];

/** All data keys for BNs returning mint values in an array */
const bigNumberMintArrays = ['marketOutcomeSums', 'unmatchedExposures'];

export function parseOrderStatus(status: OrderStatus, unmatchedStake: number) {
  switch (true) {
    case Object.prototype.hasOwnProperty.call(status, 'open'): {
      return MappedOrderStatus.OPEN;
    }
    case Object.prototype.hasOwnProperty.call(status, 'matched') && unmatchedStake > 0: {
      return MappedOrderStatus.PARTIALLY_MATCHED;
    }
    case Object.prototype.hasOwnProperty.call(status, 'matched'): {
      return MappedOrderStatus.MATCHED;
    }
    case Object.prototype.hasOwnProperty.call(status, 'settledWin'): {
      return MappedOrderStatus.WON;
    }
    case Object.prototype.hasOwnProperty.call(status, 'settledLose'): {
      return MappedOrderStatus.LOST;
    }
    case Object.prototype.hasOwnProperty.call(status, 'cancelled'): {
      return MappedOrderStatus.CANCELLED;
    }
    case Object.prototype.hasOwnProperty.call(status, 'voided'): {
      return MappedOrderStatus.VOIDED;
    }
    default: {
      return MappedOrderStatus.UNKNOWN;
    }
  }
}

const parseMarketStatus = (
  status: MarketStatus,
  inplayEnabled: boolean,
  inplay: boolean,
  marketLockTimestamp: number,
) => {
  switch (true) {
    case Object.prototype.hasOwnProperty.call(status, 'initializing'): {
      return MappedMarketStatus.INITIALIZING;
    }
    case Object.prototype.hasOwnProperty.call(status, 'readyForSettlement'): {
      return MappedMarketStatus.READY_FOR_SETTLEMENT;
    }
    case Object.prototype.hasOwnProperty.call(status, 'settled'): {
      return MappedMarketStatus.SETTLED;
    }
    case Object.prototype.hasOwnProperty.call(status, 'readyToClose'): {
      return MappedMarketStatus.READY_TO_CLOSE;
    }
    case Object.prototype.hasOwnProperty.call(status, 'readyToVoid'): {
      return MappedMarketStatus.READY_TO_VOID;
    }
    case Object.prototype.hasOwnProperty.call(status, 'voided'): {
      return MappedMarketStatus.VOIDED;
    }
    case Object.prototype.hasOwnProperty.call(status, 'open') &&
      marketLockTimestamp < nowTimestamp(): {
      return MappedMarketStatus.WAITING_FOR_SETTLEMENT;
    }
    case Object.prototype.hasOwnProperty.call(status, 'open') && inplayEnabled && !inplay: {
      return MappedMarketStatus.IN_PLAY;
    }
    case Object.prototype.hasOwnProperty.call(status, 'open') && inplayEnabled && inplay: {
      return MappedMarketStatus.LIVE_NOW;
    }
    case Object.prototype.hasOwnProperty.call(status, 'open'): {
      return MappedMarketStatus.STANDARD;
    }
    default:
      return MappedMarketStatus.UNKNOWN;
  }
};
