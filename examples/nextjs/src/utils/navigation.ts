export const generateExplorerLink = (
  publicKey: string,
  anchorAccount?: boolean,
  tokenAccounts?: boolean,
  transaction?: boolean,
) => {
  let path = 'address';
  if (transaction) path = 'tx';
  let url = `https://explorer.solana.com/${path}/${publicKey}`;
  if (anchorAccount) url += '/anchor-account';
  if (tokenAccounts) url += '/tokens';
  return url;
};
