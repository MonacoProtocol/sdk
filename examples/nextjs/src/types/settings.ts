export type ActiveSettingsProps = {
  active: {
    rpcNode?: RpcNodeProps;
    programAddress?: ProgramAddressProps;
    productProgramAddress?: ProgramAddressProps;
    default_stake: number;
    cache_orders: number;
    cache_markets: number;
    cache_market_outcomes: number;
    cache_market_matching_pools: number;
    cache_market_positions: number;
    cache_events: number;
    cache_products: number;
  };
};

type AddressProps = {
  name: string;
  address: string;
  removable: boolean;
};

export type NetworkProps = {
  name: string;
  explorerSuffix: string;
};
export type RpcNodeProps = {
  name: string;
  url: string;
  removable: boolean;
};
export type SavedWalletProps = AddressProps;
export type OperatorProps = AddressProps;
export type ProgramAddressProps = AddressProps;
export type MintProps = AddressProps & {
  decimals: number;
};

export type AppSettingsProps = ActiveSettingsProps & {
  rpcNodes: RpcNodeProps[];
  programAddresses: ProgramAddressProps[];
  mints: MintProps[];
  savedWallets: SavedWalletProps[];
  operators: OperatorProps[];
};

export enum SettingCategory {
  RPC_NODES = 'rpcNodes',
  PROGRAM_ADDRESSES = 'programAddresses',
  MINTS = 'mints',
  SAVED_WALLETS = 'savedWallets',
}
