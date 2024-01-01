import React from 'react';

import { IMarket } from '@/database/types';

import { SeederPayload } from './seedOutcome';

interface SeedMarketProps {
  payloads: SeederPayload[];
  market: IMarket;
}

const SeedMarket: React.FC<SeedMarketProps> = ({ payloads }) => {
  const handleSeedMarketClick = () => {
    const alertMessage = JSON.stringify(payloads, null, 2);

    const userConfirmed = window.confirm(
      `Confirm to seed market with the following payloads:\n\n${alertMessage}`,
    );

    if (userConfirmed) {
      console.log('Market would be seeded');
    }
  };

  return (
    <>
      <p />
      <button onClick={handleSeedMarketClick}>Seed Market (not implemented)</button>
    </>
  );
};

export default SeedMarket;
