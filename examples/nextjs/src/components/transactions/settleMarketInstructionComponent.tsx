import React from 'react';

interface Account {
  name: string;
  publicKey: string;
}

interface Data {
  winningOutcomeIndex: number;
}

interface DecodedData {
  data: Data;
  name: string;
}

interface Props {
  decoded: DecodedData;
  accounts: Account[];
}

const SettleMarketInstructionComponent: React.FC<Props> = ({ decoded }) => {
  return (
    <div>
      <p>Settle Market | Winning Outcome Index: {decoded.data.winningOutcomeIndex}</p>
    </div>
  );
};

export default SettleMarketInstructionComponent;
