import Link from 'next/link';
import React from 'react';

import { MappedMarketStatus } from '@/const/markets';
import { IMarket } from '@/database/types';
import { formatNumberForDisplay } from '@/utils/display';
import { OutcomePricesSummary } from '@/utils/mappers/marketPrices';
import { convertTimestampToDateString } from '@/utils/time';

import ExplorerLinkComponent from '../navigation/explorerLink';

interface MarketProps {
  market: IMarket;
  isLoading: boolean;
  priceSummary?: OutcomePricesSummary;
  viewMore?: boolean;
}

const MarketComponent: React.FC<MarketProps> = ({ market, isLoading, viewMore, priceSummary }) => {
  if (!market || isLoading) {
    return null;
  } else {
    const marketLock = market ? convertTimestampToDateString(market.marketLockTimestamp) : null;
    const inplayMarket = market?.inplayEnabled ? true : false;
    const inplay = market?.marketStatus === MappedMarketStatus.LIVE_NOW ? 'Live Now: 🟢' : null;
    const settled = market?.marketSettleTimestamp
      ? `| Settled on ${convertTimestampToDateString(market?.marketSettleTimestamp)} 💸`
      : null;
    return (
      <div>
        <hr />
        <h3>
          Market: {market.title} {inplayMarket ? inplay : ''}
        </h3>{' '}
        {marketLock} {settled} |{' '}
        <ExplorerLinkComponent
          publicKey={market.publicKey}
          anchorAccount={true}
          tokenAccounts={false}
        />{' '}
        |{' '}
        {priceSummary ? (
          <span>
            Liquidity: {formatNumberForDisplay(priceSummary.liquidityAmount)} | Traded{' '}
            {formatNumberForDisplay(priceSummary.matchedAmount)}
          </span>
        ) : null}
        <p />
        {viewMore ? (
          <Link
            key={`${market.publicKey}-view-more}`}
            href={`/market?publicKey=${market.publicKey}`}
            style={{ textDecoration: 'none' }}
          >
            View More Details...
          </Link>
        ) : null}
        {market.suspended ? 'MARKET SUSPENDED' : null}
        <p />
      </div>
    );
  }
};

export default MarketComponent;
