import React from 'react';

import { IProduct } from '@/database/types';

import ExplorerLinkComponent from '../navigation/explorerLink';

interface ProductProps {
  product: IProduct;
  isLoading: boolean;
}

const ProductComponent: React.FC<ProductProps> = ({ product, isLoading }) => {
  if (isLoading || !product) return null;
  return (
    <>
      <div>
        <h3>{product.productTitle}</h3>{' '}
        <ExplorerLinkComponent
          publicKey={product.publicKey}
          anchorAccount={true}
          tokenAccounts={false}
        />
        <p />
        Commission rate: {product.commissionRate}% <br />
        Escrow Account:{' '}
        <ExplorerLinkComponent
          publicKey={product.commissionEscrow}
          anchorAccount={false}
          tokenAccounts={true}
        />
        <p />
        <hr />
      </div>
    </>
  );
};

export default ProductComponent;
