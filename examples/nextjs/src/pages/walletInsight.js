import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import EventFilterComponent from '@/components/events/eventFilter';
import appSettings from '@/config/appSettings';
import { useProgram } from '@/context/ProgramContext';
import {
  getLocalEventMarketMappingForMarkets,
  getLocalEventsForMarkets,
} from '@/database/endpoints/events';
import { storeEvents } from '@/endpoints/events/fetchEvents';
import { fetchMarketOutcomesForMarkets } from '@/endpoints/markets/fetchMarketOutcomes';
import { fetchMarketPositionsForPurchaser } from '@/endpoints/markets/fetchMarketPosition';
import { fetchMarkets } from '@/endpoints/markets/fetchMarkets';
import { fetchOrdersForPurchaser } from '@/endpoints/orders/fetchOrders';
import useWalletRedirect from '@/hooks/walletRedirect';
import { formatNumberForDisplay, truncateString } from '@/utils/display';
import {
  marketOutcomesByMarketPublicKey,
  marketPositionByMarketPublicKey,
  marketsByPublicKey,
} from '@/utils/mappers/markets';
import { getUniqueMarketsFromOrders, ordersByMarketPublicKey } from '@/utils/mappers/orders';
import { generateExplorerLink } from '@/utils/navigation';
import { orderSummary } from '@/utils/orders';
import { getStoredSettings } from '@/utils/settings';

import EventComponent from '../components/events/event';
import MarketComponent from '../components/markets/market';
import MarketPositionComponent from '../components/markets/marketPosition';
import { LoadingComponent } from '../components/navigation/loading';
import OrderMatrixForAgainstComponent from '../components/orders/orderMatrixForAgainst';

import '../app/globals.css';

export default function WalletInsight() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markets, setMarkets] = useState([]);
  const [summary, setSummary] = useState(orderSummary([]));
  const [marketPositions, setMarketPositions] = useState([]);
  const [marketOutcomes, setMarketOutcomes] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventMarketMap, setEventMarketMap] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);

  const programContext = useProgram();
  const wallet = useWallet();
  useWalletRedirect();

  const savedWallets = getStoredSettings(appSettings).savedWallets;
  const publicKeyQueryString = 'publicKey';
  const queryWallet = router.query[publicKeyQueryString];

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const marketData = await fetchMarkets(programContext.program);
        setMarkets(marketData);
        if (queryWallet) {
          new PublicKey(queryWallet);
          await fetchDataForPublicKey(queryWallet);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching market data:', error);
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [programContext.program, queryWallet]);

  const fetchDataForPublicKey = async (publicKeyToUse) => {
    try {
      const [fetchedOrders, fetchedMarketPositions] = await Promise.all([
        fetchOrdersForPurchaser(programContext.program, publicKeyToUse),
        fetchMarketPositionsForPurchaser(programContext.program, publicKeyToUse),
        storeEvents(),
      ]);
      const orderMarketPks = getUniqueMarketsFromOrders(fetchedOrders);
      const [fetchedMarkets, fetchedMarketOutcomes, fetchedEvents, fetchedEventMarketMap] =
        await Promise.all([
          fetchMarkets(programContext.program, orderMarketPks),
          fetchMarketOutcomesForMarkets(programContext.program, orderMarketPks),
          getLocalEventsForMarkets(orderMarketPks),
          getLocalEventMarketMappingForMarkets(orderMarketPks),
        ]);
      setOrders(fetchedOrders);
      setMarkets(fetchedMarkets);
      setMarketOutcomes(fetchedMarketOutcomes);
      const orderedEvents = fetchedEvents.sort(
        (a, b) => a.eventStartTimestamp - b.eventStartTimestamp,
      );
      setEvents(orderedEvents);
      setMarketPositions(fetchedMarketPositions);
      setEventMarketMap(fetchedEventMarketMap);
      setSummary(orderSummary(fetchedOrders));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleWalletChange = (publicKeyToUse) => {
    try {
      setLoading(true);
      new PublicKey(publicKeyToUse);
      router.push(`/walletInsight?${publicKeyQueryString}=${publicKeyToUse}`);
      setInputValue('');
    } catch (error) {
      console.error('Invalid PublicKey:', error);
    }
  };

  const handleFilteredEvents = (filteredEvents) => {
    setFilteredEvents(filteredEvents);
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="main-wrapper">
      <div className="left-container">
        <h1>Insight</h1>
        <hr />
        <p>
          <b>Live Risk:</b> {formatNumberForDisplay(summary.liveRisk)} | <b>Won: </b>
          {formatNumberForDisplay(summary.won)} | <b>Lost: </b>
          {formatNumberForDisplay(summary.lost)} | <b>Returns: </b>
          {formatNumberForDisplay(summary.returns)} | <b>Markets:</b> {summary.numberOfMarkets}
        </p>
        {filteredEvents.map((event) => (
          <div key={event.publicKey}>
            <EventComponent event={event} isLoading={loading} />
            <div>
              {eventMarketMap
                .filter((mappedMarkets) => mappedMarkets.eventPublicKey === event.publicKey)
                .map((marketOnEvent) => (
                  <>
                    <MarketComponent
                      key={`${marketOnEvent.marketPublicKey}-component`}
                      market={marketsByPublicKey(markets, marketOnEvent.marketPublicKey)}
                      viewMore={true}
                      loading={loading}
                    />
                    <MarketPositionComponent
                      key={`${marketOnEvent.marketPublicKey}-marketPosition`}
                      marketPosition={marketPositionByMarketPublicKey(
                        marketPositions,
                        marketOnEvent.marketPublicKey,
                      )}
                      outcomes={marketOutcomesByMarketPublicKey(
                        marketOutcomes,
                        marketOnEvent.marketPublicKey,
                      )}
                      winningIndex={
                        marketsByPublicKey(markets, marketOnEvent.marketPublicKey)
                          .marketWinningOutcomeIndex
                      }
                      loading={loading}
                    />
                    <OrderMatrixForAgainstComponent
                      key={`${marketOnEvent.marketPublicKey}-orderMatrix`}
                      orders={ordersByMarketPublicKey(orders, marketOnEvent.marketPublicKey)}
                      outcomes={marketOutcomesByMarketPublicKey(
                        marketOutcomes,
                        marketOnEvent.marketPublicKey,
                      )}
                      loading={loading}
                    />
                    <hr />
                  </>
                ))}
            </div>
          </div>
        ))}
      </div>
      <div className="right-container">
        <h1>Wallet Search</h1>
        <input
          list="known-wallets"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Select or enter wallet address"
        />
        <datalist id="known-wallets">
          {savedWallets.map((wallet) => (
            <option key={wallet.address} value={wallet.address}>
              {wallet.name}
            </option>
          ))}
        </datalist>
        <button onClick={() => handleWalletChange(inputValue)}>Fetch Orders</button>
        {wallet.connected ? (
          <button onClick={() => handleWalletChange(wallet.publicKey.toString())}>My Orders</button>
        ) : null}
        <p />
        <b>Wallet on Explorer:</b>{' '}
        {queryWallet && (
          <a href={generateExplorerLink(queryWallet)} target="_blank" rel="noopener noreferrer">
            {truncateString(queryWallet)}
          </a>
        )}
        <EventFilterComponent
          events={events}
          onFilteredEvents={handleFilteredEvents}
          loading={loading}
        />
      </div>
    </div>
  );
}
