import Link from 'next/link';
import React from 'react';

import { MappedMarketStatus } from '@/const/markets';
import { IMarket } from '@/database/types';
import { truncateString } from '@/utils/display';
import { generateExplorerLink } from '@/utils/navigation';
import { convertTimestampToDateString } from '@/utils/time';

interface MarketProps {
  market: IMarket;
  isLoading: boolean;
  viewMore?: boolean;
}

const MarketComponent: React.FC<MarketProps> = ({ market, isLoading, viewMore }) => {
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
        {marketLock} {settled} | {''}
        <a
          href={generateExplorerLink(market.publicKey, true)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {truncateString(market.publicKey)}
        </a>
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
