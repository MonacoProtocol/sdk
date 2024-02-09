import { AnchorProvider, Program, Wallet, setProvider } from '@coral-xyz/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';

import appSettings from '@/config/appSettings';
import { getFromLocalStorage } from '@/utils/localStorage';

interface ProgramContextProps {
  program: Program | null;
  productProgram: Program | null;
  loading: boolean;
  error: string | null;
  rpcNodeUrl: string;
  setRpcNodeUrl: React.Dispatch<React.SetStateAction<string>>;
  activeProgramAddress: string;
  setActiveProgramAddress: React.Dispatch<React.SetStateAction<string>>;
  setActiveProductProgramAddress: React.Dispatch<React.SetStateAction<string>>;
}

const ProgramContext = createContext<ProgramContextProps | undefined>(undefined);

type ProgramProviderProps = {
  children: ReactNode;
};

export const ProgramProvider: React.FC<ProgramProviderProps> = ({ children }) => {
  const [program, setProgram] = useState<Program | null>(null);
  const [productProgram, setProductProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rpcNodeUrl, setRpcNodeUrl] = useState(
    getFromLocalStorage('active.rpcNode', appSettings.active.rpcNode).url,
  );
  const [activeProgramAddress, setActiveProgramAddress] = useState(
    getFromLocalStorage('active.programAddress', appSettings.active.programAddress).address,
  );
  const [activeProductProgramAddress, setActiveProductProgramAddress] = useState(
    getFromLocalStorage('active.productProgramAddress', appSettings.active.productProgramAddress)
      .address,
  );

  const wallet = useWallet();
  const connection = new Connection(rpcNodeUrl);

  useEffect(() => {
    const initializeProgram = async () => {
      try {
        const provider = new AnchorProvider(
          connection,
          wallet as unknown as Wallet,
          AnchorProvider.defaultOptions(),
        );
        setProvider(provider);

        const protocolAddress = new PublicKey(activeProgramAddress);
        const productProtocolAddress = new PublicKey(activeProductProgramAddress);
        const [loadedProgram, loadedProductProgram] = await Promise.all([
          Program.at(protocolAddress, provider),
          Program.at(productProtocolAddress, provider),
        ]);
        setProgram(loadedProgram);
        setProductProgram(loadedProductProgram);
        setError(null);
      } catch (e) {
        const thrownError = e as Error;
        setError(thrownError.message);
      } finally {
        setLoading(false);
      }
    };

    initializeProgram();
  }, [wallet.publicKey, rpcNodeUrl, activeProgramAddress, activeProductProgramAddress]);

  return (
    <ProgramContext.Provider
      value={{
        program,
        productProgram,
        loading,
        error,
        rpcNodeUrl,
        setRpcNodeUrl,
        activeProgramAddress,
        setActiveProgramAddress,
        setActiveProductProgramAddress,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};

export const useProgram = (): ProgramContextProps => {
  const context = useContext(ProgramContext);
  if (context === undefined) {
    throw new Error('useProgram must be used within a ProgramProvider');
  }
  return context;
};
