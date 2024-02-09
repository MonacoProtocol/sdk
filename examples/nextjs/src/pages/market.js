import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

import MarketPositionComponent from '@/components/markets/marketPosition';
import PlaceOrderComponent from '@/components/orders/placeOrder';
import SeederComponent from '@/components/seeder/seeder';
import { useProgram } from '@/context/ProgramContext';
import { getLocalEventForMarket } from '@/database/endpoints/events';
import { storeEvents } from '@/endpoints/events/fetchEvents';
import { fetchMarketMatchingPools } from '@/endpoints/markets/fetchMarketMatchingPools';
import { fetchMarketOutcomes } from '@/endpoints/markets/fetchMarketOutcomes';
import { fetchMarketPositionsForMarket } from '@/endpoints/markets/fetchMarketPosition';
import { fetchMarket } from '@/endpoints/markets/fetchMarkets';
import { fetchOrdersForMarket } from '@/endpoints/orders/fetchOrders';
import { fetchProducts } from '@/endpoints/products/fetchProducts';
import useWalletRedirect from '@/hooks/walletRedirect';
import { mapPricesFromMarketMatchingPools } from '@/utils/mappers/marketPrices';
import { getUniquePurchasersFromOrders } from '@/utils/mappers/orders';

import EventComponent from '../components/events/event';
import MarketComponent from '../components/markets/market';
import { LoadingComponent } from '../components/navigation/loading';
import OrderMatrixForAgainstComponent from '../components/orders/orderMatrixForAgainst';
import PriceMatrixComponent from '../components/priceMatrix/priceMatrix';
import PurchaserComponent from '../components/purchaser/purchaser';

import '../app/globals.css';

function MarketPage() {
  const router = useRouter();
  const [market, setMarket] = useState([]);
  const [marketOutcomes, setMarketOutcomes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [uniquePurchasers, setUniquePurchasers] = useState([]);
  const [marketPublicKey, setMarketPublicKey] = useState(null);
  const [marketPositions, setMarketPositions] = useState([]);
  const [products, setProducts] = useState([]);
  const [inputKey, setInputKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [priceSummary, setPriceSummary] = useState({});
  const [eventData, setEvent] = useState({});
  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [selectedForOutcome, setSelectedForOutcome] = useState(true);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);

  const programContext = useProgram();
  const publicKeyQueryString = 'publicKey';
  useWalletRedirect();
  const wallet = useWallet();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const queryPublicKey = router.query[publicKeyQueryString];
      if (queryPublicKey) {
        try {
          new PublicKey(queryPublicKey);
          setMarketPublicKey(queryPublicKey);
        } catch (error) {
          console.error('Error parsing public key:', error);
          setLoading(false);
        }
        try {
          const [
            marketData,
            marketMatchingPools,
            marketOutcomeData,
            fetchedOrders,
            fetchedMarketPositions,
            fetchedProducts,
          ] = await Promise.all([
            fetchMarket(programContext.program, queryPublicKey, true),
            fetchMarketMatchingPools(programContext.program, queryPublicKey, true),
            fetchMarketOutcomes(programContext.program, queryPublicKey),
            fetchOrdersForMarket(programContext.program, queryPublicKey, true),
            fetchMarketPositionsForMarket(programContext.program, queryPublicKey),
            fetchProducts(programContext.productProgram),
            storeEvents(),
          ]);
          const priceSummary = mapPricesFromMarketMatchingPools(
            marketMatchingPools,
            marketData.marketOutcomesCount,
          );

          const localEventData = await getLocalEventForMarket(marketData.publicKey);
          if (localEventData) {
            setEvent(localEventData);
            setIsLoadingEvent(false);
          }

          const purchasers = getUniquePurchasersFromOrders(
            fetchedOrders,
            wallet.publicKey.toString(),
          );

          setUniquePurchasers(purchasers);
          setMarketOutcomes(marketOutcomeData);
          setPriceSummary(priceSummary);
          setMarketPositions(fetchedMarketPositions);
          setOrders(fetchedOrders);
          setMarket(marketData);
          setProducts(fetchedProducts);
          setMarketPublicKey(queryPublicKey);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching market data:', error);
          setMarket([]);
          setMarketPublicKey('');
          setPriceSummary({});
          setMarketOutcomes([]);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [router.query]);

  const handleInputChange = (e) => {
    setInputKey(e.target.value);
  };

  const handleSubmit = () => {
    setMarket([]);
    setMarketPublicKey('');
    router.push(`/market?${publicKeyQueryString}=${inputKey}`);
    setInputKey('');
    setLoading(true);
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="main-wrapper">
      <div className="left-container">
        <EventComponent event={eventData} isLoading={isLoadingEvent} />
        {marketPublicKey && market ? (
          <>
            <MarketComponent
              key={`market-${marketPublicKey}`}
              market={market}
              priceSummary={priceSummary}
              loading={loading}
            />
            <PriceMatrixComponent
              priceSummary={priceSummary}
              marketOutcomes={marketOutcomes}
              winningIndex={market.marketWinningOutcomeIndex}
              setSelectedOutcome={setSelectedOutcome}
              setSelectedForOutcome={setSelectedForOutcome}
              setSelectedPrice={setSelectedPrice}
              loading={loading}
            />
            <div>
              <SeederComponent marketOutcomes={marketOutcomes} market={market} loading={loading} />
              <p />
              {uniquePurchasers.map((purchaser) => (
                <>
                  <hr />
                  <PurchaserComponent
                    key={`purchaser-${purchaser}`}
                    purchaser={purchaser}
                    loading={loading}
                  />
                  <MarketPositionComponent
                    key={`position-${purchaser}`}
                    loading={loading}
                    marketPosition={marketPositions.find(
                      (position) => position.purchaser === purchaser,
                    )}
                    outcomes={marketOutcomes}
                    winningIndex={market.marketWinningOutcomeIndex}
                  />
                  <OrderMatrixForAgainstComponent
                    key={`orders-${purchaser}`}
                    orders={orders.filter((marketOrders) => marketOrders.purchaser === purchaser)}
                    outcomes={marketOutcomes}
                    loading={loading}
                  />
                </>
              ))}
            </div>
          </>
        ) : null}
      </div>
      <div className="right-container">
        <h3>Search For Market</h3>
        <input
          type="text"
          placeholder="Enter market public key"
          value={inputKey}
          onChange={handleInputChange}
        />
        <button onClick={handleSubmit}>Load Market</button>
        <p />
        <PlaceOrderComponent
          market={market}
          marketOutcomes={marketOutcomes}
          products={products}
          isLoading={loading}
          orderFromMatrix={{
            market: marketPublicKey,
            outcome: selectedOutcome,
            forOutcome: selectedForOutcome,
            price: selectedPrice,
          }}
        />
      </div>
    </div>
  );
}

export default MarketPage;
