import React from 'react';
import { Translate } from 'react-localize-redux';

import { Menu, Responsive } from 'semantic-ui-react';
import { breakpoints } from '../../utils/common';
import styles from './Header.module.css';
import RightMenu from './Menus/RightMenu';
import LeftMenu from './Menus/LeftMenu';

// TODO: Evt. fjern connect - men skal så modtage `user` via parents

/**
 * Header-component. Viser headeren og tjekker at brugeren er logget ind.
 */
const Header = () => {
  return (
    <Responsive as="header" minWidth={breakpoints.mobile}>
      <h2 className={styles.onprint}>
        <Translate id="header.credit" />
      </h2>
      <Menu className={styles.noprint} inverted color="blue" attached borderless={true}>
        <LeftMenu />
        <Menu.Menu position="right">
          <RightMenu />
        </Menu.Menu>
      </Menu>
    </Responsive>
  );
};

export default Header;
