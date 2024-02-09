import { PublicKey } from '@solana/web3.js';
import { promises as fs } from 'fs';
import path from 'path';
import { useEffect, useState } from 'react';

import { LoadingComponent } from '@/components/navigation/loading';
import TransactionsComponent from '@/components/transactions/transactions';
import { useProgram } from '@/context/ProgramContext';
import { fetchProducts } from '@/endpoints/products/fetchProducts';
import { fetchParsedTransactionsForAccount } from '@/endpoints/transactions/fetchTransactions';
import useWalletRedirect from '@/hooks/walletRedirect';

function TransactionsPage({ idls }) {
  const [transactionData, setTransactionData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [publicKey, setPublicKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);

  const programContext = useProgram();
  useWalletRedirect();

  const fetchTnxData = async (publicKey) => {
    if (!publicKey) {
      setLoading(false);
      return;
    } else {
      setFetching(true);
      const tnxs = await fetchParsedTransactionsForAccount(
        programContext.program,
        new PublicKey(publicKey),
        idls,
      );
      setTransactionData(tnxs);
      setLoading(false);
      setFetching(false);
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
        {fetching ? (
          <span>Fetching...</span>
        ) : transactionData.length > 0 ? (
          <TransactionsComponent
            transactions={transactionData}
            products={productData}
            loading={loading}
          />
        ) : null}
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

export async function getServerSideProps() {
  // if we go through too many protocol iterations we may wish to allow for idl selection rather than try all
  const idlsDirectory = path.join(process.cwd(), 'src/idls/monacoProtocol');
  const filenames = await fs.readdir(idlsDirectory);
  const idlPromises = filenames
    .filter((filename) => filename.endsWith('.json'))
    .map((filename) => fs.readFile(path.join(idlsDirectory, filename), 'utf8'));

  const idls = await Promise.all(idlPromises.map(async (promise) => JSON.parse(await promise)));

  return {
    props: {
      idls,
    },
  };
}

export default TransactionsPage;
