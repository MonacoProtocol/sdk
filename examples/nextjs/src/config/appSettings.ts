import { AppSettingsProps } from '@/types/settings';

const DEFAULT_RPC = 'YOUR_RPC_NODE_URL';
export const USE_APPROVED_WALLETS = true;
export const DEFAULT_MINT_DECIMALS = 6;
export const DEFAULT_TRANSACTIONS_LIMIT = 1000;

const appSettings: AppSettingsProps = {
  active: {
    rpcNode: {
      name: 'mainnet',
      url: DEFAULT_RPC,
      removable: false,
    },
    programAddress: {
      name: 'release',
      address: 'monacoUXKtUi6vKsQwaLyxmXKSievfNWEcYXTgkbCih',
      removable: false,
    },
    productProgramAddress: {
      name: 'release',
      address: 'mppFrYmM6A4Ud3AxRbGXsGisX1HUsbDfp1nrg9FQJEE',
      removable: false,
    },
    default_stake: 1.0,
    cache_orders: 10,
    cache_markets: 10,
    cache_market_outcomes: 10,
    cache_market_matching_pools: 10,
    cache_market_positions: 10,
    cache_events: 10,
    cache_products: 1440,
  },
  rpcNodes: [
    {
      name: 'mainnet',
      url: DEFAULT_RPC,
      removable: false,
    },
  ],
  programAddresses: [
    {
      name: 'release',
      address: 'monacoUXKtUi6vKsQwaLyxmXKSievfNWEcYXTgkbCih',
      removable: false,
    },
  ],
  mints: [
    {
      name: 'USDC',
      address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      decimals: 6,
      removable: false,
    },
  ],
  savedWallets: [
    {
      name: 'Example',
      address: '99kfM9BB5ZGf8tUWxP4qhLeoaUUv5PuiXbUpoWa1w3oL',
      removable: false,
    },
  ],
  operators: [
    {
      name: 'BetDEX',
      address: 'J2LqciLvyxVHMjMcda73459zWfFxw7rveDb5YAhSdGTe',
      removable: false,
    },
  ],
};

export default appSettings;
