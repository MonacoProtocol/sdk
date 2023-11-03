import React from 'react';

import { ProgramAddressProps, SettingCategory } from '@/types/settings';

import NameAddressForm from '../forms/nameAddress';

interface Props {
  programAddresses: ProgramAddressProps[];
  onAddSetting: (category: string, node: ProgramAddressProps) => void;
  onSetActive: (program: ProgramAddressProps) => void;
  onRemove: (programName: string) => void;
}

const ProgramAddressesDisplay: React.FC<Props> = ({
  programAddresses,
  onAddSetting,
  onSetActive,
  onRemove,
}) => {
  return (
    <div>
      <h2>Program Addresses</h2>
      <ul>
        {programAddresses.map((program) => (
          <li key={program.name}>
            <a onClick={() => onSetActive(program)}>{program.name}</a>: {program.address}{' '}
            {program.removable && <button onClick={() => onRemove(program.name)}>Remove</button>}
          </li>
        ))}
      </ul>
      <h3>Add New Program Address</h3>
      <NameAddressForm
        onAdd={(name, address) => {
          const newAddress: ProgramAddressProps = { name, address, removable: true };
          onAddSetting(SettingCategory.PROGRAM_ADDRESSES, newAddress);
        }}
      />
    </div>
  );
};

export default ProgramAddressesDisplay;
