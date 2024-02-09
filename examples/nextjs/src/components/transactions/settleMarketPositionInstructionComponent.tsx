import React from 'react';

import { findPublicKeyFromAccountsByName } from '@/utils/mappers/transactions';

import AccountInfoComponent from './accountList';
import ExplorerLinkComponent from '../navigation/explorerLink';

interface Account {
  name: string;
  publicKey: string;
}

interface DecodedData {
  data: object;
  name: string;
}

interface Props {
  decoded: DecodedData;
  accounts: Account[];
}

const SettleMarketPositionInstructionComponent: React.FC<Props> = ({ accounts }) => {
  return (
    <div>
      <p>
        Settle Market Position |{' '}
        <ExplorerLinkComponent
          publicKey={findPublicKeyFromAccountsByName('marketPosition', accounts)}
          anchorAccount={true}
          tokenAccounts={false}
        />{' '}
        | Token Account:{' '}
        <ExplorerLinkComponent
          publicKey={findPublicKeyFromAccountsByName('purchaserTokenAccount', accounts)}
          anchorAccount={false}
          tokenAccounts={true}
        />{' '}
      </p>
      <AccountInfoComponent accounts={accounts} />
    </div>
  );
};

export default SettleMarketPositionInstructionComponent;
