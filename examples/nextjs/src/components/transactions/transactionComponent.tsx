import React from 'react';

import { IProduct } from '@/database/types';
import { convertTimestampToDateString } from '@/utils/time';

import CancelOrderInstructionComponent from './cancelOrderInstructionComponent';
import CreateOrderInstructionComponent from './createOrderInstructionComponent';
import MatchOrderInstructionComponent from './matchOrderInstructionComponent';
import ProcessCommissionInstructionComponent from './processCommissionInstructionComponent';
import SettleMarketInstructionComponent from './settleMarketInstructionComponent';
import SettleMarketPositionInstructionComponent from './settleMarketPositionInstructionComponent';
import SettleOrderInstructionComponent from './settleOrderInstructionComponent';
import ExplorerLinkComponent from '../navigation/explorerLink';

interface Account {
  name: string;
  publicKey: string;
}

interface Instruction {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  decoded: any;
  accounts: Account[];
}

interface Props {
  instructions: Instruction[];
  signatures: string[];
  blockTime: number;
  products: IProduct[];
}

enum MappedInstructions {
  CANCEL_ORDER = 'cancelOrder',
  CREATE_ORDER = 'createOrderV2',
  MATCH_ORDERS = 'matchOrders',
  SETTLE_MARKET = 'settleMarket',
  SETTLE_MARKET_POSITION = 'settleMarketPosition',
  SETTLE_ORDER = 'settleOrder',
  PROCESS_COMMISSION_PAYMENT = 'processCommissionPayment',
}

const TransactionComponent: React.FC<Props> = ({
  instructions,
  signatures,
  blockTime,
  products,
}) => {
  return (
    <div>
      <hr />
      <p>
        {convertTimestampToDateString(blockTime)} |{' '}
        <ExplorerLinkComponent
          publicKey={signatures[0]}
          anchorAccount={false}
          tokenAccounts={false}
          transaction={true}
        />
      </p>
      {instructions
        .filter((instruction) => instruction.decoded && instruction.decoded.name)
        .map((instruction, index) => (
          <div key={index}>
            {instruction.decoded.name === MappedInstructions.CANCEL_ORDER && (
              <CancelOrderInstructionComponent
                decoded={instruction.decoded}
                accounts={instruction.accounts}
              />
            )}
            {instruction.decoded.name === MappedInstructions.CREATE_ORDER && (
              <CreateOrderInstructionComponent
                decoded={instruction.decoded}
                accounts={instruction.accounts}
                products={products}
              />
            )}
            {instruction.decoded.name === MappedInstructions.MATCH_ORDERS && (
              <MatchOrderInstructionComponent
                decoded={instruction.decoded}
                accounts={instruction.accounts}
              />
            )}
            {instruction.decoded.name === MappedInstructions.SETTLE_MARKET && (
              <SettleMarketInstructionComponent
                decoded={instruction.decoded}
                accounts={instruction.accounts}
              />
            )}
            {instruction.decoded.name === MappedInstructions.SETTLE_MARKET_POSITION && (
              <SettleMarketPositionInstructionComponent
                decoded={instruction.decoded}
                accounts={instruction.accounts}
              />
            )}
            {instruction.decoded.name === MappedInstructions.SETTLE_ORDER && (
              <SettleOrderInstructionComponent
                decoded={instruction.decoded}
                accounts={instruction.accounts}
              />
            )}
            {instruction.decoded.name === MappedInstructions.PROCESS_COMMISSION_PAYMENT && (
              <ProcessCommissionInstructionComponent
                decoded={instruction.decoded}
                accounts={instruction.accounts}
                products={products}
              />
            )}
            {!Object.values(MappedInstructions).includes(instruction.decoded.name) && (
              <p>{instruction.decoded.name}</p>
            )}
          </div>
        ))}
    </div>
  );
};

export default TransactionComponent;
