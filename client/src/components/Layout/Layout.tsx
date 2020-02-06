import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { breakpoints } from 'utils/common';

export interface LayoutProps {}

const Layout: React.SFC<LayoutProps> = ({ children }) => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWidth(window.innerWidth);
    });

    return window.removeEventListener('resize', () => setWidth(window.innerWidth));
  }, []);

  if (width < breakpoints.mobile)
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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      {children}
      <div style={{ flexGrow: 1 }} />
      <Footer />
    </div>
  );
};

export default Layout;
