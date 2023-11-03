import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

import EventComponent from '@/components/events/event';
import { LoadingComponent } from '@/components/navigation/loading';
import OrderMatrixComponent from '@/components/orders/orderMatrix';
import { useProgram } from '@/context/ProgramContext';
import { fetchEvents } from '@/endpoints/events/fetchEvents';
import { fetchMarket } from '@/endpoints/markets/fetchMarkets';
import { fetchOrdersForPurchaser } from '@/endpoints/orders/fetchOrders';
import useWalletRedirect from '@/hooks/walletRedirect';
import { getUniqueMarketsFromOrders, ordersByMarketPublicKey } from '@/utils/mappers/orders';

// Unused Example Your Orders Page (less info than wallet insight)

function OrdersPage() {
  const [orderData, setOrderData] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const programContext = useProgram();
  const wallet = useWallet();
  useWalletRedirect();

  useEffect(() => {
    const fetchProductData = async () => {
      if (wallet.publicKey) {
        const orderDataResponse = await fetchOrdersForPurchaser(
          programContext.program,
          wallet.publicKey?.toString(),
        );
        const uniqueMarketsOnOrders = getUniqueMarketsFromOrders(orderDataResponse);
        const fetchedMarkets = await Promise.all(
          uniqueMarketsOnOrders.map(async (market) => {
            return await fetchMarket(programContext.program, market);
          }),
        );
        const fetchedEvents = await fetchEvents();
        setOrderData(orderDataResponse);
        setMarkets(fetchedMarkets);
        setEvents(fetchedEvents);
        setLoading(false);
      }
    };

    fetchProductData();
  }, [programContext.program]);

  if (loading) {
    return <LoadingComponent />;
  }
  return (
    <div className="main-wrapper">
      <div className="left-container">
        <h1>Your Orders</h1>
        <hr />
        <div>
          {markets.map((market) => (
            <>
              <EventComponent
                event={events.find((event) => event.publicKey === market.eventAccount)}
                markets={[market]}
                isLoading={loading}
              />
              <OrderMatrixComponent
                key={`orders-${market.publicKey}`}
                orders={ordersByMarketPublicKey(orderData, market.publicKey)}
                loading={loading}
              />
            </>
          ))}
        </div>
      </div>
      <div className="right-container"></div>
    </div>
  );
}

export default OrdersPage;
