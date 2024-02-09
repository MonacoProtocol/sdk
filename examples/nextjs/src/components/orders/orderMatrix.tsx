import { useWallet } from '@solana/wallet-adapter-react';
import React from 'react';

import './orderMatrix.css';
import { MappedOrderStatus } from '@/const/orders';
import { useProgram } from '@/context/ProgramContext';
import { IOrder } from '@/database/types';
import cancelOrderByPk from '@/endpoints/orders/cancelOrder';
import { formatNumberForDisplay, truncateString } from '@/utils/display';
import { generateExplorerLink } from '@/utils/navigation';

interface OrderMatrixProps {
  orders: IOrder[];
  loading: boolean;
}

const OrderMatrixComponent: React.FC<OrderMatrixProps> = ({ orders, loading }) => {
  const wallet = useWallet();
  const programContext = useProgram();
  const handleCancelOrder = (order: IOrder) => {
    const confirmation = window.confirm(
      `Are you sure you want to cancel order: ${order.publicKey}`,
    );
    if (confirmation && programContext.program) {
      cancelOrderByPk(programContext.program, { publicKey: order.publicKey });
    }
  };

  if (orders.length < 1 || loading) return null;
  else {
    orders.sort((a, b) => (a.expectedPrice > b.expectedPrice ? 1 : -1));
    return (
      <table className="order-matrix">
        <thead>
          <tr>
            <th>Stake</th>
            <th>Price</th>
            <th>Status</th>
            <th>Risked</th>
            <th>Matched</th>
            <th>Payout</th>
            <th>Order</th>
            <th>Cancel</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={`${order.publicKey}-${order.purchaser}`}>
              <td>{formatNumberForDisplay(order.stake)}</td>
              <td>{order.expectedPrice}</td>
              <td>
                {order.orderStatus === MappedOrderStatus.PARTIALLY_MATCHED
                  ? 'PARTIAL'
                  : order.orderStatus}
              </td>
              <td>{formatNumberForDisplay(order.risked)}</td>
              <td>
                {formatNumberForDisplay(order.stake - order.voidedStake - order.stakeUnmatched)}
              </td>
              <td>
                {order.orderStatus === MappedOrderStatus.WON
                  ? formatNumberForDisplay(order.payout)
                  : '$ 0'}
              </td>
              <td className="price-cell-payout">
                <b>
                  <a
                    href={generateExplorerLink(order.publicKey, true)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {truncateString(order.publicKey)}
                  </a>
                </b>
              </td>
              <td>
                {[
                  MappedOrderStatus.OPEN.valueOf(),
                  MappedOrderStatus.PARTIALLY_MATCHED.valueOf(),
                ].includes(order.orderStatus) &&
                wallet.publicKey?.toString() === order.purchaser ? (
                  <button onClick={() => handleCancelOrder(order)} className="cancel-order-button">
                    🗑
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
};

export default OrderMatrixComponent;
