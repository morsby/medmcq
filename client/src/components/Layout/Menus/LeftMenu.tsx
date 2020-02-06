import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Menu, Image } from 'semantic-ui-react';
import logo from '../logo/aulogo_dk_var2_hvid.png';

const LeftMenu = ({ handleNavigation }) => {
  return (
    <Menu.Item onClick={() => handleNavigation('/')}>
      <Image src={logo} size="small" style={{ height: '30px' }} />
    </Menu.Item>
  );
};

LeftMenu.propTypes = {
  history: ReactRouterPropTypes.history
};

export default LeftMenu;
