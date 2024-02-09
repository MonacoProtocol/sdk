import React from 'react';

import { IMarketOutcome } from '@/database/types';
import { OutcomePricesSummary } from '@/utils/mappers/marketPrices';
import './priceMatrix.css';

interface MarketPricesProps {
  priceSummary: OutcomePricesSummary;
  marketOutcomes: IMarketOutcome[];
  loading: boolean;
  setSelectedOutcome: React.Dispatch<React.SetStateAction<number>>;
  setSelectedForOutcome: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPrice: React.Dispatch<React.SetStateAction<number>>;
  winningIndex?: number;
}

const PriceMatrixComponent: React.FC<MarketPricesProps> = ({
  priceSummary,
  marketOutcomes,
  loading,
  winningIndex,
  setSelectedOutcome,
  setSelectedForOutcome,
  setSelectedPrice,
}) => {
  if (!priceSummary || loading) {
    return null;
  }

  const handleCellClick = (outcome: number, forOutcome: boolean, priceValue: number) => {
    setSelectedOutcome(outcome);
    setSelectedForOutcome(forOutcome);
    setSelectedPrice(priceValue);
  };

  return (
    <table className="price-matrix">
      <thead>
        <tr>
          <th>Outcome</th>
          <th>Last Traded</th>
          <th colSpan={3}>For</th>
          <th colSpan={3}>Against</th>
        </tr>
      </thead>
      <tbody>
        {priceSummary.prices.slice(0, 3).map((price, index) => (
          <tr key={`price-${index}`} className={index === winningIndex ? 'winning' : ''}>
            <td className="outcome-name">{marketOutcomes ? marketOutcomes[index].title : index}</td>
            <td>
              {marketOutcomes[index].latestMatchedPrice > 0
                ? marketOutcomes[index].latestMatchedPrice
                : '-'}
            </td>

            {Array(Math.max(3 - price.against.length, 0))
              .fill(null)
              .map((_, idx) =>
                idx < 3 ? (
                  <td key={`${index}-zero-price-for-${idx}`} className="price-cell-empty">
                    -
                  </td>
                ) : null,
              )}

            {price.against
              .slice(0, 3)
              .reverse()
              .map((price) => (
                <td
                  key={`${index}-${price.price}-for`}
                  className={'price-cell-for'}
                  onClick={() => handleCellClick(index, true, price.price)}
                >
                  {price.price}
                  <br />
                  (${price.liquidityAmount})
                </td>
              ))}

            {price.for.slice(0, 3).map((price) => (
              <td
                key={`${index}-${price.price}-against`}
                className={'price-cell-against'}
                onClick={() => handleCellClick(index, false, price.price)}
              >
                {price.price}
                <br />
                (${price.liquidityAmount})
              </td>
            ))}

            {Array(Math.max(3 - price.for.length, 0))
              .fill(null)
              .map((_, idx) =>
                idx < 3 ? (
                  <td key={`${index}-zero-price-against-${idx}`} className="price-cell-empty">
                    -
                  </td>
                ) : null,
              )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PriceMatrixComponent;
