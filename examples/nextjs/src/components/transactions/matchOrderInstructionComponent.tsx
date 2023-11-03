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

const MatchOrderInstructionComponent: React.FC<Props> = ({ accounts }) => {
  return (
    <div>
      <p>
        <p />
        Match Orders:{' '}
        <ExplorerLinkComponent
          publicKey={findPublicKeyFromAccountsByName('orderFor', accounts)}
          anchorAccount={true}
          tokenAccounts={false}
        />{' '}
        &{' '}
        <ExplorerLinkComponent
          publicKey={findPublicKeyFromAccountsByName('orderAgainst', accounts)}
          anchorAccount={true}
          tokenAccounts={false}
        />{' '}
        <br />
        Trades:{' '}
        <ExplorerLinkComponent
          publicKey={findPublicKeyFromAccountsByName('tradeFor', accounts)}
          anchorAccount={true}
          tokenAccounts={false}
        />{' '}
        &{' '}
        <ExplorerLinkComponent
          publicKey={findPublicKeyFromAccountsByName('tradeAgainst', accounts)}
          anchorAccount={true}
          tokenAccounts={false}
        />{' '}
        <br />
        Purchasers:{' '}
        <ExplorerLinkComponent
          publicKey={findPublicKeyFromAccountsByName('purchaserTokenAccountFor', accounts)}
          anchorAccount={true}
          tokenAccounts={false}
        />{' '}
        &{' '}
        <ExplorerLinkComponent
          publicKey={findPublicKeyFromAccountsByName('purchaserTokenAccountAgainst', accounts)}
          anchorAccount={true}
          tokenAccounts={false}
        />{' '}
      </p>
    </div>
  );
};

export default MatchOrderInstructionComponent;
