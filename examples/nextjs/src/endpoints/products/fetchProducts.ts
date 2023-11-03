import { Program } from '@coral-xyz/anchor';
import { GetAccount, Products } from '@monaco-protocol/client';
import { Product } from '@monaco-protocol/client/types/product';

import db from '@/database/database';
import { getLastFetchTimestamp, updateFetchTime } from '@/database/endpoints/database';
import { getLocalProducts } from '@/database/endpoints/products';
import { parseResponseData } from '@/utils/parsers';
import { getStoredSettings } from '@/utils/settings';
import { hasElapsed } from '@/utils/time';

const CACHE_DURATION_MINUTES = getStoredSettings().active.cache_products;

export const fetchProducts = async (program: Program) => {
  const cache = await checkCache();
  if (cache) return cache;
  try {
    const productData = await Products.productQuery(program).fetch();
    if (productData.success) {
      parseResponseData(productData.data);
      const productsToStorePromises = productData.data.productAccounts.map((product) => {
        productForDb(product);
      });
      await Promise.all(productsToStorePromises);
      await updateFetchTime('products');
      return getLocalProducts();
    } else {
      console.log(productData.errors);
      throw new Error(`Error returned from fetchProducts endpoint`);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

const checkCache = async () => {
  const lastUpdate = await getLastFetchTimestamp('products');
  const allProducts = await getLocalProducts();
  if (lastUpdate && !hasElapsed(lastUpdate, CACHE_DURATION_MINUTES) && allProducts.length > 0) {
    console.log(`Last update was less than ${CACHE_DURATION_MINUTES} mins ago`);
    return allProducts;
  }
};

const productForDb = (product: GetAccount<Product>) => {
  return db.products.put({
    publicKey: product.publicKey.toString(),
    authority: product.account.authority.toString(),
    payer: product.account.payer.toString(),
    commissionEscrow: product.account.commissionEscrow.toString(),
    productTitle: product.account.productTitle,
    commissionRate: product.account.commissionRate,
  });
};
