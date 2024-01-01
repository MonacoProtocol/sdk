import { Program } from '@coral-xyz/anchor';
import React, { useEffect, useState } from 'react';

import appSettings from '@/config/appSettings';
import { MappedMarketStatus, OPEN_MARKET_STATUSES } from '@/const/markets';
import { DEFAULT_PRICE_LADDER, ForAgainst } from '@/const/orders';
import { useProgram } from '@/context/ProgramContext';
import { IMarket, IMarketOutcome, IProduct } from '@/database/types';
import { fetchBalance } from '@/endpoints/balance/fetchBalance';
import placeOrder, { OrderDetails } from '@/endpoints/orders/placeOrder';
import { formatNumberForDisplay, sentenceCase } from '@/utils/display';
import { getStoredSettings } from '@/utils/settings';

interface PlaceOrderProps {
  market: IMarket;
  marketOutcomes: IMarketOutcome[];
  isLoading: boolean;
  orderFromMatrix: OrderDetails;
  products: IProduct[];
}

const PlaceOrderComponent: React.FC<PlaceOrderProps> = ({
  market,
  marketOutcomes,
  isLoading,
  products,
  orderFromMatrix,
}) => {
  const [order, setOrder] = useState<OrderDetails>({
    market: market.publicKey,
    outcome: 0,
    forOutcome: true,
    price: 2.0,
    stake: getStoredSettings().active.default_stake,
  });
  const [allProducts] = useState<IProduct[]>(products);
  const [status] = useState<string>(market.marketStatus);
  const [productTitles, setProductTitles] = useState<string[]>([]);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [loadingBalance, setLoadingBalance] = useState<boolean>(true);
  const priceLadder = DEFAULT_PRICE_LADDER;

  const programContext = useProgram();

  useEffect(() => {
    const fetchBalances = async () => {
      if (programContext.program) {
        setLoadingBalance(true);
        const USDC = appSettings.mints.find((m) => m.name === 'USDC')?.address || '';
        const balanceResponse = await fetchBalance(programContext.program);
        const solana = balanceResponse.balances.find((b) => b.token === 'solana')?.balance.uiAmount;
        const token = balanceResponse.balances.find((b) => b.token === USDC)?.balance.uiAmount;
        setSolBalance(solana || 0);
        setTokenBalance(token || 0);
        setLoadingBalance(false);
      }
    };

    fetchBalances();
  }, [programContext.program]);

  useEffect(() => {
    if (
      orderFromMatrix.outcome !== null &&
      orderFromMatrix.price &&
      JSON.stringify(order) !== JSON.stringify(orderFromMatrix)
    ) {
      updateOrder(orderFromMatrix);
    }
  }, [orderFromMatrix]);

  useEffect(() => {
    const titles = products.map((product) => product.productTitle);
    titles.unshift('No Product');
    setProductTitles(titles);
  }, [products]);

  const updateOrder = (updates: Partial<OrderDetails>) => {
    setOrder((prevOrder) => ({ ...prevOrder, ...updates }));
  };

  const handlePlaceOrder = async () => {
    if (programContext.program) {
      console.log('place order', order);
      await placeOrder(programContext.program as Program, order);
    }
  };

  if (isLoading || !marketOutcomes) {
    return null;
  }

  return (
    <>
      <div>
        <h2>Balance</h2>
        <hr />
        <p />
        Solana: {loadingBalance ? '...loading' : formatNumberForDisplay(solBalance, true)}
        <br />
        USDC: {loadingBalance ? '...loading' : formatNumberForDisplay(tokenBalance)}
        <p />
        {!market.suspended && OPEN_MARKET_STATUSES.includes(status as MappedMarketStatus) && (
          <div>
            <h2>Place Order</h2>
            <hr />
            <p />
            Outcome:{' '}
            <select
              value={order.outcome ? order.outcome : 0}
              onChange={(e) => updateOrder({ outcome: Number(e.target.value) })}
            >
              {marketOutcomes.map((outcome, index) => (
                <option value={index} key={index}>
                  {outcome.title}
                </option>
              ))}
            </select>
            <p />
            For/Against:{' '}
            <select
              value={order.forOutcome ? ForAgainst.FOR : ForAgainst.AGAINST}
              onChange={(e) => {
                const value = e.target.value;
                if (value === ForAgainst.FOR) {
                  updateOrder({ forOutcome: true });
                } else {
                  updateOrder({ forOutcome: false });
                }
              }}
            >
              <option value={ForAgainst.FOR}>{sentenceCase(ForAgainst.FOR)}</option>
              <option value={ForAgainst.AGAINST}>{sentenceCase(ForAgainst.AGAINST)}</option>
            </select>
            <p />
            Stake:{' '}
            <input
              type="number"
              value={order.stake}
              onInput={(e) =>
                updateOrder({ stake: parseFloat((e.target as HTMLInputElement).value) })
              }
            />
            <p />
            Price:{' '}
            <select
              value={order.price === undefined ? '' : order.price}
              onChange={(e) => updateOrder({ price: Number(e.target.value) })}
            >
              <option value="">Select Price</option>
              {priceLadder.map((price, index) => (
                <option value={price} key={index}>
                  {price}
                </option>
              ))}
            </select>
            <p />
            Risk:{' '}
            {order.stake
              ? order.forOutcome
                ? formatNumberForDisplay(order.stake)
                : formatNumberForDisplay(order.price * order.stake - order.stake)
              : formatNumberForDisplay(0)}
            <p />
            Potential Profit:{' '}
            {order.stake
              ? order.forOutcome
                ? formatNumberForDisplay(order.price * order.stake - order.stake)
                : formatNumberForDisplay(order.stake)
              : formatNumberForDisplay(0)}
            <p />
            Product:{' '}
            <select
              value={order.product ? order.product : 'No Product Selected'}
              onChange={(e) => {
                if (e.target.value === 'No Product') {
                  updateOrder({ product: null });
                } else {
                  updateOrder({
                    product: e.target.value,
                  });
                }
              }}
            >
              {productTitles.map((product) => (
                <option value={product} key={product}>
                  {product}
                </option>
              ))}
            </select>
            <p />
            {order.product
              ? `This product will charge ${allProducts.find(
                  (product) => product.productTitle === order.product,
                )?.commissionRate}% on your overall market profit`
              : 'No Product Selected'}
            <p />
            <button onClick={handlePlaceOrder}>Place Order</button>
          </div>
        )}
        {market.suspended ||
          (!OPEN_MARKET_STATUSES.includes(status as MappedMarketStatus) && (
            <h3>Market Not Taking Orders</h3>
          ))}
      </div>
    </>
  );
};

export default PlaceOrderComponent;
