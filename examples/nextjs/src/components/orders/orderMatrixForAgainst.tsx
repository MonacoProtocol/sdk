import { IMarketOutcome, IOrder } from '@/database/types';
import { getUniqueOutcomeIndexesFromOrders } from '@/utils/mappers/orders';

import OrderMatrixComponent from './orderMatrix';
import './orderMatrix.css';

interface OrderMatrixForAgainstProps {
  orders: IOrder[];
  loading: boolean;
  outcomes?: IMarketOutcome[];
}

const OrderMatrixForAgainstComponent: React.FC<OrderMatrixForAgainstProps> = ({
  orders,
  loading,
  outcomes,
}) => {
  if (!orders || loading) return null;
  else {
    const orderOutcomes = getUniqueOutcomeIndexesFromOrders(orders);
    const forOrders = orders.filter((order) => order.forOutcome === true);
    const againstOrders = orders.filter((order) => order.forOutcome === false);
    return (
      <div>
        {orderOutcomes.map((outcomeIndex) => (
          <div
            key={`${outcomeIndex}-${orders[0].market}-${orders[0].purchaser}`}
            className="matrix-container"
          >
            <h3 className="matrix-header">
              Outcome :{' '}
              {outcomes
                ? outcomes.find((outcomeAccount) => outcomeAccount.index === outcomeIndex)?.title
                : outcomeIndex}
            </h3>
            <div className="order-wrapper">
              <div className="for">
                <h4>{forOrders.length > 0 ? 'For' : null}</h4>
                {forOrders.length > 0 && (
                  <OrderMatrixComponent
                    orders={forOrders.filter(
                      (forOrder) => forOrder.marketOutcomeIndex === outcomeIndex,
                    )}
                    loading={loading}
                  />
                )}
              </div>

              <div className="against">
                <h4>{againstOrders.length > 0 ? 'Against' : null}</h4>
                {againstOrders.length > 0 && (
                  <OrderMatrixComponent
                    orders={againstOrders.filter(
                      (againstOrder) => againstOrder.marketOutcomeIndex === outcomeIndex,
                    )}
                    loading={loading}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
};

export default OrderMatrixForAgainstComponent;
