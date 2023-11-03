import { useState } from 'react';

import { MintFormProps } from '@/types/forms';

function MintForm({ onAdd }: MintFormProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [decimals, setDecimals] = useState('');

  const handleSubmit = () => {
    onAdd(name, address, Number(decimals));
    setName('');
    setAddress('');
    setDecimals('');
  };

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
      <input
        value={decimals}
        onChange={(e) => setDecimals(e.target.value)}
        placeholder="Decimals"
        type="number"
      />
      <button onClick={handleSubmit}>Add</button>
    </div>
  );
}

export default MintForm;
