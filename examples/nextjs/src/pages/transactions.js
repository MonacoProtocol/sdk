import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';

import { LoadingComponent } from '@/components/navigation/loading';
import TransactionsComponent from '@/components/transactions/transactions';
import { useProgram } from '@/context/ProgramContext';
import { fetchProducts } from '@/endpoints/products/fetchProducts';
import { fetchParsedTransactionsForAccount } from '@/endpoints/transactions/fetchTransactions';
import useWalletRedirect from '@/hooks/walletRedirect';

function TransactionsPage() {
  const [transactionData, setTransactionData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [publicKey, setPublicKey] = useState('');
  const [loading, setLoading] = useState(true);

  const programContext = useProgram();
  useWalletRedirect();

  const fetchTnxData = async (publicKey) => {
    if (!publicKey) {
      setLoading(false);
      return;
    } else {
      const tnxs = await fetchParsedTransactionsForAccount(
        programContext.program,
        new PublicKey(publicKey),
      );
      setTransactionData(tnxs);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProductData = async () => {
      const products = await fetchProducts(programContext.productProgram);
      setProductData(products);
    };
    fetchProductData();
    fetchTnxData(publicKey);
  }, [programContext.program]);

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="main-wrapper">
      <div className="left-container">
        <h1>Transactions</h1>
        {transactionData.length > 0 ? (
          <TransactionsComponent
            transactions={transactionData}
            products={productData}
            loading={loading}
          />
        ) : (
          <p>No Transactions Found</p>
        )}
      </div>
      <div className="right-container">
        <h1>Search For Account</h1>
        <input
          type="text"
          value={publicKey}
          onChange={(e) => setPublicKey(e.target.value)}
          placeholder="Enter Public Key"
        />
        <button onClick={() => fetchTnxData(publicKey)}>Fetch Transactions</button>
        <p />
      </div>
    </div>
  );
}

export default TransactionsPage;
