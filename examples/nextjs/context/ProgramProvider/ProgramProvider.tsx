import { AnchorProvider, Program } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { ReactNode, useEffect, useReducer, useState } from "react";
import { ProgramActionTypes, reducer } from "./reducer";
import { ProgramContext, initalState } from "./state";

type ProgramProviderProps = {
  children: ReactNode;
};

export const ProgramProvider = ({
  children,
}: ProgramProviderProps) => {
  const [program, dispatch] = useReducer(reducer, initalState);
  const [provider, setProvider] = useState<AnchorProvider | null>(null);
  const wallet = useWallet();
  const connection = new Connection(process.env.NEXT_PUBLIC_NODE);

  useEffect(() => {
    if (connection !== null) {
      setProvider(new AnchorProvider(
        connection,
        wallet as any,
        AnchorProvider.defaultOptions(),
      ));
    }
  }, []);

  const setProgram = async () => {
    try {
      if (provider !== null) {
        const program = await Program.at(new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID), provider);
        dispatch({
          type: ProgramActionTypes.SET_PROGRAM,
          payload: program,
        });
      }
    } catch (error) {
      throw "Cannot set program";
    }
  };

  useEffect(() => {
    if (provider) {
      setProgram();
    }
  }, [provider]);

  return (
    <ProgramContext.Provider value={program}>
      {program === null ? "initialising" : children}
    </ProgramContext.Provider>
  );
};
