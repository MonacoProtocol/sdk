import { useEffect, useState } from 'react';

import { LoadingComponent } from '@/components/navigation/loading';
import ProductComponent from '@/components/products/product';
import { useProgram } from '@/context/ProgramContext';
import { fetchProducts } from '@/endpoints/products/fetchProducts';
import useWalletRedirect from '@/hooks/walletRedirect';

function ProductsPage() {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);

  const programContext = useProgram();
  useWalletRedirect();

  useEffect(() => {
    const fetchProductData = async () => {
      const productData = await fetchProducts(programContext.productProgram);
      setProductData(productData);
      setLoading(false);
    };

    fetchProductData();
  }, [programContext.program]);

  if (loading) {
    return <LoadingComponent />;
  }
  return (
    <div className="main-wrapper">
      <div className="left-container">
        <h1>Products</h1>
        <hr />
        <div>
          {productData.map((product) => (
            <ProductComponent
              key={`${product.productTitle}-${product.authority}`}
              product={product}
              isLoading={loading}
            />
          ))}
        </div>
      </div>
      <div className="right-container"></div>
    </div>
  );
}

export default ProductsPage;
