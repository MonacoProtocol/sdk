import React from 'react';

import { IProduct } from '@/database/types';
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
  products: IProduct[];
}

const ProcessCommissionInstructionComponent: React.FC<Props> = ({ accounts, products }) => {
  const productKey = findPublicKeyFromAccountsByName('product', accounts);
  const product = products.find((product) => product.publicKey === productKey);
  const productName = product ? product.productTitle : 'Unknown Product';

  return (
    <div>
      <p>
        Process Commission | {productName}{' '}
        <ExplorerLinkComponent publicKey={productKey} anchorAccount={true} tokenAccounts={false} />{' '}
        | Escrow:{' '}
        <ExplorerLinkComponent
          publicKey={findPublicKeyFromAccountsByName('commissionEscrow', accounts)}
          anchorAccount={false}
          tokenAccounts={true}
        />{' '}
      </p>
      <AccountInfoComponent accounts={accounts} />
    </div>
  );
};

export default ProcessCommissionInstructionComponent;
