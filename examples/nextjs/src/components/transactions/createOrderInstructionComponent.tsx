import { BN } from '@coral-xyz/anchor';
import React from 'react';

import { IProduct } from '@/database/types';
import { formatNumberForDisplay } from '@/utils/display';
import { findPublicKeyFromAccountsByName } from '@/utils/mappers/transactions';
import { integerToUiValue } from '@/utils/parsers';

import AccountInfoComponent from './accountList';
import ExplorerLinkComponent from '../navigation/explorerLink';

interface Account {
  name: string;
  publicKey: string;
}

interface Data {
  marketOutcomeIndex: number;
  forOutcome: boolean;
  stake: BN;
  price: number;
}

interface Decoded {
  data: {
    distinctSeed: string;
    data: Data;
  };
  name: string;
}

interface OrderInstructionProps {
  decoded: Decoded;
  accounts: Account[];
  products: IProduct[];
}

const CreateOrderInstructionComponent: React.FC<OrderInstructionProps> = ({
  decoded,
  accounts,
  products,
}) => {
  const {
    data: {
      data: { marketOutcomeIndex, forOutcome, stake, price },
    },
  } = decoded;
  const productKey = findPublicKeyFromAccountsByName('product', accounts);
  const product = products.find((product) => product.publicKey === productKey);
  const productName = product ? product.productTitle : 'None';
  return (
    <div>
      {'Create Order'} |{' '}
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
      | Purchaser:{' '}
      <ExplorerLinkComponent
        publicKey={findPublicKeyFromAccountsByName('purchaser', accounts)}
        anchorAccount={false}
        tokenAccounts={false}
      />{' '}
      <p />
      Outcome: {marketOutcomeIndex} | For: {forOutcome ? 'Yes' : 'No'} |{' '}
      {formatNumberForDisplay(integerToUiValue(stake, 6))} @ {price} | Product: [{productName}]{' '}
      <ExplorerLinkComponent
        publicKey={findPublicKeyFromAccountsByName('product', accounts)}
        anchorAccount={true}
        tokenAccounts={false}
      />{' '}
      <p />
      <AccountInfoComponent accounts={accounts} />
    </div>
  );
};

export default CreateOrderInstructionComponent;
