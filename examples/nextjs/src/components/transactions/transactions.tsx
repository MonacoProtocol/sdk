import React from 'react';
import './style.css';

import { IProduct } from '@/database/types';

import TransactionComponent from './transactionComponent';

interface Account {
  name: string;
  publicKey: string;
}

interface Instruction {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  decoded: any;
  accounts: Account[];
}

interface Transaction {
  instructions: Instruction[];
  signatures: string[];
  blockTime: number;
  slot: number;
}

interface Props {
  transactions: Transaction[];
  products: IProduct[];
  loading: boolean;
}

const TransactionsComponent: React.FC<Props> = ({ transactions, products, loading }) => {
  if (loading) return null;
  return (
    <div className="transactionsContainer">
      {transactions.map((transaction, index) => (
        <TransactionComponent
          key={index}
          instructions={transaction.instructions}
          signatures={transaction.signatures}
          blockTime={transaction.blockTime}
          products={products}
        />
      ))}
    </div>
  );
};

export default TransactionsComponent;
