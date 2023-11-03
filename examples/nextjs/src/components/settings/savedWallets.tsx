import { SavedWalletProps, SettingCategory } from '@/types/settings';

import NameAddressForm from '../forms/nameAddress';

interface Props {
  savedWallets: SavedWalletProps[];
  onAddSetting: (category: string, wallet: SavedWalletProps) => void;
  onRemove: (name: string) => void;
}

const SavedWalletsComponent: React.FC<Props> = ({ savedWallets, onAddSetting, onRemove }) => {
  if (!savedWallets) return null;
  return (
    <div>
      <h2>Saved Wallets</h2>
      <ul>
        {savedWallets.map((wallet) => (
          <li key={wallet.name}>
            {wallet.name}: {wallet.address}{' '}
            {wallet.removable && <button onClick={() => onRemove(wallet.name)}>Remove</button>}
          </li>
        ))}
      </ul>
      <h3>Add Wallet</h3>
      <NameAddressForm
        onAdd={(name, address) => {
          const newWallet: SavedWalletProps = { name, address, removable: true };
          onAddSetting(SettingCategory.SAVED_WALLETS, newWallet);
        }}
      />
    </div>
  );
};

export default SavedWalletsComponent;
