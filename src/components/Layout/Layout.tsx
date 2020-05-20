import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

export interface LayoutProps {}

const Layout: React.SFC<LayoutProps> = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Sidebar>
        <Header />
        {children}
        <div style={{ flexGrow: 1 }} />
        <Footer />
      </Sidebar>
    </div>
  );
};

export default Layout;
