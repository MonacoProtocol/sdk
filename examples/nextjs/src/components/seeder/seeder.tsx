import React from 'react';

import { MappedMarketStatus, OPEN_MARKET_STATUSES } from '@/const/markets';
import { IMarket, IMarketOutcome } from '@/database/types';

import SeedMarket from './seedMarket';
import SeedsForOutcomeComponent, { SeederPayload } from './seedOutcome';

interface SeederProps {
  marketOutcomes: IMarketOutcome[];
  market: IMarket;
  loading: boolean;
}

const SeederComponent: React.FC<SeederProps> = ({ marketOutcomes, market, loading }) => {
  const [seederPayloads, setSeederPayloads] = React.useState<SeederPayload[]>([]);

  const handlePayloadChange = (outcomeIndex: number) => (payload: SeederPayload) => {
    setSeederPayloads((prevState) => {
      const updated = [...prevState];
      updated[outcomeIndex] = payload;
      return updated;
    });
  };

  console.log('seederPayloads', seederPayloads);

  if (loading) return null;
  if (market.suspended || !OPEN_MARKET_STATUSES.includes(market.marketStatus as MappedMarketStatus))
    return null;
  return (
    <div className="seeder">
      <hr />
      <h2>Market Seeder</h2>
      <div>
        {marketOutcomes.map((marketOutcome, index) => (
          <SeedsForOutcomeComponent
            key={marketOutcome.title}
            marketOutcome={marketOutcome}
            market={market}
            onPayloadChange={handlePayloadChange(index)}
          />
        ))}
      </div>
      <SeedMarket payloads={seederPayloads} market={market} />
    </div>
  );
};

export default SeederComponent;
