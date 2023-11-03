import React from 'react';

import { truncateString } from '@/utils/display';
import { generateExplorerLink } from '@/utils/navigation';

interface Props {
  publicKey: string;
  anchorAccount: boolean;
  tokenAccounts: boolean;
  transaction?: boolean;
}

const ExplorerLinkComponent: React.FC<Props> = ({
  publicKey,
  anchorAccount,
  tokenAccounts,
  transaction,
}) => {
  if (!publicKey) return null;
  return (
    <a
      href={generateExplorerLink(publicKey, anchorAccount, tokenAccounts, transaction)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {truncateString(publicKey)}
    </a>
  );
};

export default ExplorerLinkComponent;
