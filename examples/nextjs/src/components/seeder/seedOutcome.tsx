import { SeedManager } from '@monaco-protocol/seed-calculator';
import React, { useEffect, useReducer } from 'react';

import { DEFAULT_PRICE_LADDER } from '@/const/orders';
import { IMarket, IMarketOutcome } from '@/database/types';
import { SeederSettings, SeederSides } from '@/types/settings';
import { getStoredSeederSettings, saveSeederSettings } from '@/utils/seeder/seederSettings';

import SeedMatrixComponent from './seedMatrix';

interface Seed {
  stake: number;
  price: number;
  return: number;
}

export interface SeederPayload {
  marketOutcomeIndex: number;
  forSeeds: Seed[];
  againstSeeds: Seed[];
}

interface SeedsForOutcomeProps {
  marketOutcome: IMarketOutcome;
  market: IMarket;
  onPayloadChange?: (payload: SeederPayload) => void;
}

function outcomeReducer(state: SeederSettings, action: { field: string; payload: string }) {
  return {
    ...state,
    [action.field]: action.payload,
  };
}

function outcomeSeedsId(market: IMarket, marketOutcome: IMarketOutcome) {
  return `${market.publicKey}-${marketOutcome.index}`;
}

const seedsForSides = (sides: SeederSides, seedManager: SeedManager) => {
  const emptySeed: Seed = { stake: 0, price: 0, return: 0 };
  const seeds = {
    for: [] as Seed[],
    against: [] as Seed[],
  };
  switch (sides) {
    case SeederSides.FOR_AGAINST:
      seeds.for = seedManager.forSeeds;
      seeds.against = seedManager.againstSeeds;
      break;
    case SeederSides.FOR:
      seeds.against = seedManager.againstSeeds;
      break;
    case SeederSides.AGAINST:
      seeds.for = seedManager.forSeeds;
      break;
  }
  while (seeds.for.length < 3) seeds.for.push(emptySeed);
  while (seeds.against.length < 3) seeds.against.push(emptySeed);
  seeds.against.reverse();
  return seeds;
};

const SeedsForOutcomeComponent: React.FC<SeedsForOutcomeProps> = ({
  marketOutcome,
  market,
  onPayloadChange,
}) => {
  const [seedsId] = React.useState<string>(outcomeSeedsId(market, marketOutcome));
  const [state, dispatch] = useReducer(outcomeReducer, getStoredSeederSettings(seedsId));
  const [forSeeds, setForSeeds] = React.useState<Seed[]>([]);
  const [againstSeeds, setAgainstSeeds] = React.useState<Seed[]>([]);

  const numberOptions = Array.from({ length: 10 }, (_, i) => i + 1);
  const defaultDepthOptions = Array.from({ length: 20 }, (_, i) => (i + 1) * 5).reverse();
  const depthOptions = [...defaultDepthOptions, 0];
  const sidesOptions = [
    SeederSides.FOR_AGAINST,
    SeederSides.FOR,
    SeederSides.AGAINST,
    SeederSides.NEITHER,
  ];

  const handleChange = (field: string) => (e: { target: { type: string; value: string } }) => {
    dispatch({
      field,
      payload: e.target.value,
    });
  };

  useEffect(() => {
    const depths = [parseFloat(state.depth1)];
    state.depth2 != '0' ? depths.push(parseFloat(state.depth2)) : null;
    state.depth3 != '0' ? depths.push(parseFloat(state.depth3)) : null;

    try {
      const manager = SeedManager.initialize(
        parseFloat(state.truePrice.toString()),
        parseFloat(state.spread),
        parseFloat(state.steps),
        parseFloat(state.backToWin),
        parseFloat(state.layToLose),
        true,
        depths,
      );

      const seeds = seedsForSides(state.sides as SeederSides, manager);
      setForSeeds(seeds.for);
      setAgainstSeeds(seeds.against);

      saveSeederSettings(state, seedsId);

      if (onPayloadChange) {
        onPayloadChange({
          marketOutcomeIndex: marketOutcome.index,
          forSeeds: seeds.for ? seeds.for : [],
          againstSeeds: seeds.against ? seeds.against : [],
        });
      }
    } catch (e) {
      console.log('error', e);
    }
  }, [state]);

  return (
    <div className={`outcome-container outcome-${marketOutcome.index}`}>
      <h3>{marketOutcome.title}</h3>
      <form>
        {/* True Price dropdown */}
        <label>
          True Price:{' '}
          <select value={state.truePrice} onChange={handleChange('truePrice')}>
            {DEFAULT_PRICE_LADDER.map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>{' '}
        </label>
        {/* Spread dropdown */}
        <label>
          Spread:{' '}
          <select value={state.spread} onChange={handleChange('spread')}>
            {numberOptions.map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>{' '}
        </label>
        {/* Steps dropdown */}
        <label>
          Steps:{' '}
          <select value={state.steps} onChange={handleChange('steps')}>
            {numberOptions.map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>{' '}
        </label>
        {/* Depth % 1 dropdown */}
        <label>
          Depth 1 %:{' '}
          <select value={state.depth1} onChange={handleChange('depth1')}>
            {defaultDepthOptions.map((depth) => (
              <option key={depth} value={depth}>
                {depth}
              </option>
            ))}
          </select>{' '}
        </label>
        {/* Depth % 2 dropdown */}
        <label>
          Depth 2 %:{' '}
          <select value={state.depth2} onChange={handleChange('depth2')}>
            {depthOptions.map((depth) => (
              <option key={depth} value={depth}>
                {depth}
              </option>
            ))}
          </select>{' '}
        </label>
        {/* Depth % 3 dropdown */}
        <label>
          Depth 3 %:{' '}
          <select value={state.depth3} onChange={handleChange('depth3')}>
            {depthOptions.map((depth) => (
              <option key={depth} value={depth}>
                {depth}
              </option>
            ))}
          </select>{' '}
        </label>
        {/* Sides dropdown */}
        <label>
          Sides:{' '}
          <select value={state.sides} onChange={handleChange('sides')}>
            {sidesOptions.map((side) => (
              <option key={side} value={side}>
                {side}
              </option>
            ))}
          </select>{' '}
        </label>
        {/* Back To Win input */}
        <label>
          Back To Win:{' '}
          <input type="number" value={state.backToWin} onChange={handleChange('backToWin')} />
        </label>{' '}
        {/* Lay To Lose input */}
        <label>
          Lay To Lose:{' '}
          <input type="number" value={state.layToLose} onChange={handleChange('layToLose')} />
        </label>{' '}
      </form>
      <SeedMatrixComponent againstSeeds={againstSeeds} forSeeds={forSeeds} />
    </div>
  );
};

export default SeedsForOutcomeComponent;
