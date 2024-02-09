import React from 'react';

import { formatNumberForDisplay, truncateString } from '@/utils/display';
import { OutcomePricesSummary } from '@/utils/mappers/marketPrices';

interface MarketPricesProps {
  priceSummary: OutcomePricesSummary;
  isLoadingPrices: boolean;
}

const MarketPricesComponent: React.FC<MarketPricesProps> = ({ priceSummary, isLoadingPrices }) => {
  if (isLoadingPrices) {
    return null;
  }

  return (
    <div>
      Liquidity: {formatNumberForDisplay(priceSummary.liquidityAmount)}
      <br />
      Matched Amount: {formatNumberForDisplay(priceSummary.matchedAmount)}
      {priceSummary.prices.map((price, index) => (
        <div key={`${index}`}>
          <h3>Index: {index}</h3>

          <h4>For</h4>
          {price.for.map((forPrice) => (
            <div key={forPrice.publicKey}>
              <p>
                PublicKey: {truncateString(forPrice.publicKey)}
                <br />
                Price: {forPrice.price}
                <br />
                Liquidity Amount: {formatNumberForDisplay(forPrice.liquidityAmount)}
                <br />
                Matched Amount: {formatNumberForDisplay(forPrice.matchedAmount)}
              </p>
            </div>
          ))}

          <h4>Against</h4>
          {price.against.map((againstPrice) => (
            <div key={againstPrice.publicKey}>
              <p>
                PublicKey: {truncateString(againstPrice.publicKey)}
                <br />
                Prices: {againstPrice.price}
                <br />
                Liquidity Amount: {formatNumberForDisplay(againstPrice.liquidityAmount)}
                <br />
                Matched Amount: {formatNumberForDisplay(againstPrice.matchedAmount)}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MarketPricesComponent;
