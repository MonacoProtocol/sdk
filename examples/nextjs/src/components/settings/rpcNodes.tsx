import React from 'react';

import { RpcNodeProps, SettingCategory } from '@/types/settings';

import NameAddressForm from '../forms/nameAddress';

interface Props {
  rpcNodes: RpcNodeProps[];
  onAddSetting: (category: string, node: RpcNodeProps) => void;
  onSetActive: (node: RpcNodeProps) => void;
  onRemove: (nodeName: string) => void;
}

const RPCNodesDisplay: React.FC<Props> = ({ rpcNodes, onAddSetting, onSetActive, onRemove }) => {
  return (
    <div>
      <h2>RPC Nodes</h2>
      <ul>
        {rpcNodes.map((node) => (
          <li key={node.name}>
            <a onClick={() => onSetActive(node)}>{node.name}</a>: {node.url}{' '}
            {node.removable && <button onClick={() => onRemove(node.name)}>Remove</button>}
          </li>
        ))}
      </ul>
      <h3>Add New Node</h3>
      <NameAddressForm
        onAdd={(name, address) => {
          const newNode: RpcNodeProps = { name, url: address, removable: true };
          onAddSetting(SettingCategory.RPC_NODES, newNode);
        }}
      />
    </div>
  );
};

export default RPCNodesDisplay;
