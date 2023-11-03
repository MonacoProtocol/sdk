import { Program } from '@coral-xyz/anchor';
import { GetWalletBalancesResponse, getWalletTokenBalancesWithSol } from '@monaco-protocol/client';
import { PublicKey } from '@solana/web3.js';

import appSettings from '@/config/appSettings';

const CACHE_TIME = 120000; // 120 seconds in milliseconds

export const fetchBalance = async (
  program: Program,
  useCache = true,
): Promise<GetWalletBalancesResponse> => {
  const currentTime = new Date().getTime();
  const cachedData = localStorage.getItem('balanceData');

  if (useCache && cachedData) {
    const parsedData = JSON.parse(cachedData);
    if (currentTime - parsedData.timestamp < CACHE_TIME) {
      return parsedData;
    }
  }

  const USDC = appSettings.mints.find((m) => m.name === 'USDC')?.address || '';
  const response = await getWalletTokenBalancesWithSol(program, [new PublicKey(USDC)]);

  if (response.success) {
    localStorage.setItem(
      'balanceData',
      JSON.stringify({
        ...response.data,
        timestamp: currentTime,
      }),
    );
  }
  return response.data;
};
