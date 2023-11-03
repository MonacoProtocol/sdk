import { BorshCoder, Instruction, Program } from '@coral-xyz/anchor';
import { PublicKey, ConfirmedSignatureInfo, ParsedTransactionWithMeta } from '@solana/web3.js';

import { DEFAULT_TRANSACTIONS_LIMIT } from '@/config/appSettings';

const fetchConfirmedSignatures = async (
  program: Program,
  account: PublicKey,
  limit: number = DEFAULT_TRANSACTIONS_LIMIT,
): Promise<ConfirmedSignatureInfo[]> => {
  const options = {
    limit: limit,
  };
  let signatures = [] as ConfirmedSignatureInfo[];
  try {
    const signaturesRequest = await program.provider.connection.getConfirmedSignaturesForAddress2(
      account,
      options,
    );
    signatures = signaturesRequest.map((signature: { signature: unknown }) => {
      return signature.signature;
    }) as ConfirmedSignatureInfo[];
  } catch (e) {
    // no op
  }
  return signatures;
};

const fetchTransactionsForAccount = async (
  program: Program,
  account: PublicKey,
  limit: number = DEFAULT_TRANSACTIONS_LIMIT,
): Promise<ParsedTransactionWithMeta[] | null[]> => {
  let transactions = [] as ParsedTransactionWithMeta[];
  try {
    const signatures = await fetchConfirmedSignatures(program, account, limit);
    transactions = (await program.provider.connection.getParsedTransactions(
      signatures as unknown as string[],
    )) as unknown as ParsedTransactionWithMeta[];
    return transactions;
  } catch (e) {
    //  no op
  }
  return transactions;
};

type MappedAccount = {
  name: string;
  publicKey: string;
};

type DecodedInstruction = {
  decoded: Instruction;
  accounts: MappedAccount[];
};

type ParsedTransaction = {
  instructions: DecodedInstruction[];
  signatures: string[];
  blockTime: string;
  slot: number;
};

export const fetchParsedTransactionsForAccount = async (
  program: Program,
  account: PublicKey,
): Promise<ParsedTransaction[]> => {
  if (program.idl) {
    const tnxs = await fetchTransactionsForAccount(program, account);
    const idl = program.idl;
    const coder = new BorshCoder(idl);
    const decodedIxs = tnxs.map((tnx) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const instructions = tnx?.transaction.message.instructions.map((ix: any) => {
        const decodedIx = coder.instruction.decode(ix.data, 'base58');
        const idlInstruction = decodedIx?.name
          ? idl.instructions.find((instruction) => instruction.name === decodedIx.name)
          : undefined;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedAccounts = ix.accounts.map((account: any, i: number) => {
          return {
            name: idlInstruction?.accounts[i].name,
            publicKey: account.toBase58(),
          };
        });
        return { decoded: decodedIx, accounts: mappedAccounts };
      });
      return {
        instructions,
        signatures: tnx?.transaction.signatures,
        blockTime: tnx?.blockTime,
        slot: tnx?.slot,
      } as unknown as ParsedTransaction;
    });
    return decodedIxs;
  } else {
    return [];
  }
};
