import React from 'react';

import { IMarketOutcome, IMarketPosition } from '@/database/types';
import { formatNumberForDisplay, truncateString } from '@/utils/display';
import { generateExplorerLink } from '@/utils/navigation';
import './marketPosition.css';

interface MarketPositionProps {
  marketPosition?: IMarketPosition;
  outcomes?: IMarketOutcome[];
  winningIndex?: number;
  loading?: boolean;
}

const MarketPositionComponent: React.FC<MarketPositionProps> = ({
  marketPosition,
  outcomes,
  winningIndex,
  loading,
}) => {
  if (!marketPosition || loading) {
    return null;
  }

  return (
    <div>
      <h3>
        Market Position:{' '}
        <a
          href={generateExplorerLink(marketPosition.publicKey, true)}
          target="_blank"
          rel="noreferrer"
        >
          {truncateString(marketPosition.publicKey)}
        </a>
      </h3>
      <p />
      {paidOrPending(marketPosition.paid)}
      <br />
      <table className="market-position">
        <thead>
          <tr>
            <th>Outcome</th>
            <th>Position</th>
            <th>Unmatched Exposures</th>
          </tr>
        </thead>
        <tbody>
          {marketPosition.marketOutcomeSums.map((outcomeSum, index) => (
            <tr
              key={`market-position-${index}-${marketPosition.purchaser}`}
              className={winOrLossOnPosition(index, winningIndex, outcomeSum)}
            >
              <td>{outcomes && outcomes[index] ? outcomes[index].title : index}</td>
              <td>{formatNumberForDisplay(outcomeSum)}</td>
              <td>
                {marketPosition.paid
                  ? '-'
                  : formatNumberForDisplay(marketPosition.unmatchedExposures[index])}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

function paidOrPending(bool: boolean) {
  return bool ? 'Paid ✅' : 'Pending 🕦';
}

function winOrLossOnPosition(index: number, winningIndex: number | undefined, outcomeSum: number) {
  if (index === winningIndex) {
    if (outcomeSum > 0) {
      return 'profit';
    } else if (outcomeSum < 0) {
      return 'loss';
    }
  }
  return '';
}

export default MarketPositionComponent;
