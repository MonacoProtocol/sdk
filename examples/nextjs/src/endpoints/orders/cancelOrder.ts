import { Program } from '@coral-xyz/anchor';
import { cancelOrder } from '@monaco-protocol/client';
import { PublicKey } from '@solana/web3.js';

export interface OrderDetails {
  publicKey: string;
}

export const cancelOrderByPk = async (program: Program, OrderDetails: OrderDetails) => {
  try {
    const cancelResponse = await cancelOrder(program, new PublicKey(OrderDetails.publicKey));
    if (cancelResponse.success) {
      console.log(`tnx Id: ${cancelResponse.data.tnxID}`);
      return cancelResponse.data;
    } else {
      console.log(cancelResponse.errors);
      throw new Error(`Error returned from cancelOrder endpoint`);
    }
  } catch (error) {
    console.error('Error cancelling order:', error);
  }
};

export default cancelOrderByPk;
