import db from '../database';
import { IProduct } from '../types';

export const getLocalProducts = async (): Promise<IProduct[]> => {
  const products = await db.products.orderBy('productTitle').toArray();
  return products;
};

export const getLocalProductByTitle = async (productTitle: string): Promise<IProduct> => {
  const product = await db.products.where('productTitle').equals(productTitle).first();
  return product;
};
