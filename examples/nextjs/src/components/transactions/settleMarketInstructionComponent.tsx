import React from 'react';

import AccountInfoComponent from './accountList';

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

const SettleMarketInstructionComponent: React.FC<Props> = ({ decoded, accounts }) => {
  return (
    <div>
      <p>Settle Market | Winning Outcome Index: {decoded.data.winningOutcomeIndex}</p>
      <AccountInfoComponent accounts={accounts} />
    </div>
  );
};

export default SettleMarketInstructionComponent;
