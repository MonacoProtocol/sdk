import React, { useState } from 'react';

import './style.css';
import ExplorerLinkComponent from '../navigation/explorerLink';

interface Account {
  name: string;
  publicKey: string;
}

interface Props {
  accounts: Account[];
}

const AccountInfoComponent: React.FC<Props> = ({ accounts }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="account-info-container">
      <div className="account-info-header" onClick={toggleCollapse}>
        Accounts
      </div>
      {!isCollapsed && (
        <table className="account-info-table">
          <thead>
            <tr>
              <th>Account</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, index) => (
              <tr key={index}>
                <td>{account.name}</td>
                <td>
                  <ExplorerLinkComponent
                    publicKey={account.publicKey}
                    anchorAccount={false}
                    tokenAccounts={false}
                  />{' '}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AccountInfoComponent;
