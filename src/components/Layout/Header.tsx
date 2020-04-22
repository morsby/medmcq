import React from 'react';
import { Translate } from 'react-localize-redux';

import { Menu, Responsive } from 'semantic-ui-react';
import { breakpoints } from '../../utils/common';
import styles from './Header.module.css';
import RightMenu from './Menus/RightMenu';
import LeftMenu from './Menus/LeftMenu';
import { useHistory } from 'react-router';

// TODO: Evt. fjern connect - men skal så modtage `user` via parents

/**
 * Header-component. Viser headeren og tjekker at brugeren er logget ind.
 */
export interface HeaderProps {}

const Header: React.SFC<HeaderProps> = () => {
  const history = useHistory();

  const handleNavigation = (url) => {
    history.push(url);
  };

  return (
    <Responsive as="header" minWidth={breakpoints.mobile}>
      <h2 className={styles.onprint}>
        <Translate id="header.credit" />
      </h2>
      <Menu className={styles.noprint} inverted color="blue" attached borderless>
        <LeftMenu handleNavigation={handleNavigation} />
        <Menu.Menu position="right">
          <RightMenu handleNavigation={handleNavigation} />
        </Menu.Menu>
      </Menu>
    </Responsive>
  );
};

export default Header;
