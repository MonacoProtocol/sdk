import React, { useState, useEffect } from 'react';

import { MappedMarketStatus } from '@/const/markets';
import { useProgram } from '@/context/ProgramContext';
import { storeEvents } from '@/endpoints/events/fetchEvents';
import { fetchMarkets } from '@/endpoints/markets/fetchMarkets';
import useWalletRedirect from '@/hooks/walletRedirect';

import MarketComponent from '../components/markets/market';
import { LoadingComponent } from '../components/navigation/loading';

import '../app/globals.css';

const marketsForSelector = [
  MappedMarketStatus.ALL,
  MappedMarketStatus.INITIALIZING,
  MappedMarketStatus.STANDARD,
  MappedMarketStatus.IN_PLAY,
  MappedMarketStatus.LIVE_NOW,
  MappedMarketStatus.WAITING_FOR_SETTLEMENT,
  MappedMarketStatus.SETTLED,
  MappedMarketStatus.VOIDED,
];

function MarketsPage() {
  const [markets, setMarkets] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(MappedMarketStatus.STANDARD);
  const [loading, setLoading] = useState(true);

  const programContext = useProgram();
  useWalletRedirect();

  useEffect(() => {
    const fetchMarketData = async () => {
      const [marketData] = await Promise.all([fetchMarkets(programContext.program), storeEvents()]);
      setMarkets(marketData);
      setLoading(false);
    };

    fetchMarketData();
  }, [programContext.program]);

  let filteredMarkets = markets;
  if (selectedStatus != MappedMarketStatus.ALL) {
    filteredMarkets = markets.filter((market) => market.marketStatus === selectedStatus);
  }

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="main-wrapper">
      <div className="left-container">
        <h2>Markets</h2>
        {filteredMarkets.map((market) => (
          <MarketComponent
            key={`${market.publicKey}-component`}
            market={market}
            viewMore={true}
            isLoading={loading}
          />
        ))}
        <p />
      </div>
      <div className="right-container">
        <h2>Filter</h2>
        <div>
          <label htmlFor="marketStatus">Market Status: </label>
          <select
            id="marketStatus"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {marketsForSelector.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <p />
        Number of markets: {filteredMarkets.length}
        <ul>
          {filteredMarkets.map((market) => (
            <li key={market.publicKey}>{market.publicKey}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MarketsPage;
