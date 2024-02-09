import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { APPROVED_WALLETS } from '@/config/approvedWallets';
import { USE_APPROVED_WALLETS } from '@/config/appSettings';

const useWalletRedirect = () => {
  const wallet = useWallet();
  const router = useRouter();

  useEffect(() => {
    const approvedWallets = APPROVED_WALLETS;
    if (USE_APPROVED_WALLETS) {
      if (
        !wallet.connected ||
        (wallet.publicKey && !approvedWallets.includes(wallet.publicKey?.toString()))
      ) {
        router.push('/');
      }
    }
  }, [wallet, router]);
};

export default useWalletRedirect;
