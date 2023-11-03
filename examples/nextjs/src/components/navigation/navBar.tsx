import Link from 'next/link';
import React from 'react';

import Clock from '../ui/clock';
import ConnectWalletButton from '../ui/connect-wallet-button';
import './navBar.css';

function NavBar() {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li key="nav-bar-events">
          <Link href="/events">Events</Link>
        </li>
        <li key="nav-bar-markets">
          <Link href="/markets">Markets</Link>
        </li>
        <li key="nav-bar-market">
          <Link href="/market">Market</Link>
        </li>
        <li key="nav-bar-wallet-insight">
          <Link href="/walletInsight">Wallet Insight</Link>
        </li>
        <li key="nav-bar-transactions">
          <Link href="/transactions">Transactions</Link>
        </li>
        <li key="nav-bar-products">
          <Link href="/products">Products</Link>
        </li>
        <li key="nav-bar-settings">
          <Link href="/settings">Settings</Link>
        </li>
        <li key="nav-bar-connect-container" className="wallet-btn-container">
          {' '}
          <ConnectWalletButton></ConnectWalletButton>
        </li>
      </ul>
      <span className="navbar-clock">
        <Clock />
      </span>
    </nav>
  );
}

export default NavBar;
