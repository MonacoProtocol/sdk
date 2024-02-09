import React, { ReactNode } from 'react';

import Footer from '../components/navigation/footer';
import NavBar from '../components/navigation/navBar';

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <NavBar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
