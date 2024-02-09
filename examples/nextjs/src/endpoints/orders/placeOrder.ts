import { Program } from '@coral-xyz/anchor';
import { createOrderUiStake } from '@monaco-protocol/client';
import { PublicKey } from '@solana/web3.js';

import { getLocalProductByTitle } from '@/database/endpoints/products';

export interface OrderDetails {
  market: string;
  outcome: number;
  forOutcome: boolean;
  price: number;
  stake?: number;
  product?: string | null;
}

export const placeOrder = async (program: Program, OrderDetails: OrderDetails) => {
  try {
    const product = OrderDetails.product
      ? await getLocalProductByTitle(OrderDetails.product as string)
      : null;
    let productPk = undefined;
    if (product) productPk = new PublicKey(product.publicKey);
    const orderResponse = await createOrderUiStake(
      program,
      new PublicKey(OrderDetails.market),
      OrderDetails.outcome,
      OrderDetails.forOutcome,
      OrderDetails.price,
      OrderDetails.stake as number,
      new PublicKey('GGBay2i5Kut37XVNfVLSDuoCyyAELLtNHqMxU2YhRRUK'), // DEFAULT_PRICE_LADDER account
      productPk,
    );
    if (orderResponse.success) {
      console.log(orderResponse.data.tnxID);
      return orderResponse.data;
    } else {
      console.log(orderResponse.errors);
      throw new Error(`Error returned from placeOrder endpoint`);
    }
  } catch (error) {
    console.error('Error placing order:', error);
  }
};

export default placeOrder;
