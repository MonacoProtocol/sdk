// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const findPublicKeyFromAccountsByName = (name: string, accounts: any[]) => {
  const account = accounts.find((account) => account.name === name);
  return account ? account.publicKey : null;
};
