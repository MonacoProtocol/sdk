import { useState } from 'react';

import { NameAddressFormProps } from '@/types/forms';

function NameAddressForm({ onAdd }: NameAddressFormProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = () => {
    if (name.trim() !== '' && address.trim() !== '') {
      onAdd(name, address);
      setName('');
      setAddress('');
    }
  };

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
      <button onClick={handleSubmit}>Add</button>
    </div>
  );
}

export default NameAddressForm;
