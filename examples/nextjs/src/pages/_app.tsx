import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import type { AppProps } from 'next/app';
import React, { useMemo } from 'react';
import type { FC } from 'react';

import Layout from '@/app/layout';
import { ProgramProvider } from '@/context/ProgramContext';
import '../app/globals.css';

require('@solana/wallet-adapter-react-ui/styles.css');

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    [network],
  );

  return (
    <>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <ProgramProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ProgramProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
};

export default App;
