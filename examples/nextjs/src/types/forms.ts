export type NameAddressFormProps = {
  onAdd: (name: string, address: string) => void;
};

export type MintFormProps = {
  onAdd: (name: string, address: string, decimals: number) => void;
};
