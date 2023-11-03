import React from 'react';

import { MintProps, SettingCategory } from '@/types/settings';

import MintForm from '../forms/mint';

interface Props {
  mints: MintProps[];
  onAddSetting: (category: string, node: MintProps) => void;
  onRemove: (mintName: string) => void;
}

const MintsDisplay: React.FC<Props> = ({ mints, onAddSetting, onRemove }) => {
  return (
    <div>
      <h2>Mints</h2>
      <ul>
        {mints.map((mint) => (
          <li key={mint.name}>
            {mint.name}: {mint.address} - {mint.decimals}{' '}
            {mint.removable && <button onClick={() => onRemove(mint.name)}>Remove</button>}
          </li>
        ))}
      </ul>
      <h3>Add New Mint</h3>
      <MintForm
        onAdd={(name, address, decimals) => {
          const newMint: MintProps = { name, address, decimals, removable: true };
          onAddSetting(SettingCategory.MINTS, newMint);
        }}
      />
    </div>
  );
};

export default MintsDisplay;
