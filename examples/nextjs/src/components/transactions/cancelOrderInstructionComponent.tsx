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

const CancelOrderInstructionComponent: React.FC<Props> = ({ accounts }) => {
  return (
    <div>
      <p>
        Cancel Order |{' '}
        <ExplorerLinkComponent
          publicKey={findPublicKeyFromAccountsByName('order', accounts)}
          anchorAccount={true}
          tokenAccounts={false}
        />{' '}
        | Market:{' '}
        <ExplorerLinkComponent
          publicKey={findPublicKeyFromAccountsByName('market', accounts)}
          anchorAccount={true}
          tokenAccounts={false}
        />{' '}
      </p>
    </div>
  );
};

export default CancelOrderInstructionComponent;
