import React from 'react';

import { findPublicKeyFromAccountsByName } from '@/utils/mappers/transactions';

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

const SettleOrderInstructionComponent: React.FC<Props> = ({ accounts }) => {
  return (
    <div>
      <p>
        Settle Order |{' '}
        <ExplorerLinkComponent
          publicKey={findPublicKeyFromAccountsByName('order', accounts)}
          anchorAccount={true}
          tokenAccounts={false}
        />{' '}
        | Purchaser:{' '}
        <ExplorerLinkComponent
          publicKey={findPublicKeyFromAccountsByName('purchaser', accounts)}
          anchorAccount={false}
          tokenAccounts={false}
        />{' '}
      </p>
    </div>
  );
};

export default SettleOrderInstructionComponent;
