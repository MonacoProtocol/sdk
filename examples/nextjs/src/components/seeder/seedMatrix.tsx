import React from 'react';

import './style.css';
import { formatNumberForDisplay, sentenceCase } from '@/utils/display';

interface Seed {
  stake: number;
  price: number;
  return: number;
}

interface SelectedSeedsProps {
  againstSeeds: Seed[];
  forSeeds: Seed[];
}

type SeedKey = keyof Seed;

const SeedMatrixComponent: React.FC<SelectedSeedsProps> = ({ againstSeeds, forSeeds }) => {
  const rowLabels: SeedKey[] = ['price', 'stake', 'return'];

  return (
    <table className="selected-seeds-table">
      <thead>
        <tr>
          <th></th>
          <th colSpan={3}>For</th>
          <th colSpan={3}>Against</th>
        </tr>
      </thead>
      <tbody>
        {rowLabels.map((label) => (
          <tr key={label}>
            <th>{sentenceCase(label)}</th>
            {againstSeeds.map((seed, index) =>
              label === 'stake' ? (
                <td key={`against-${index}-${label}`}>{formatNumberForDisplay(seed[label])}</td>
              ) : (
                <td key={`against-${index}-${label}`}>{seed[label]}</td>
              ),
            )}
            {forSeeds.map((seed, index) =>
              label === 'stake' ? (
                <td key={`for-${index}-${label}`}>{formatNumberForDisplay(seed[label])}</td>
              ) : (
                <td key={`for-${index}-${label}`}>{seed[label]}</td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SeedMatrixComponent;
