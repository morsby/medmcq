import React from 'react';
import { Menu, Image } from 'semantic-ui-react';
import logo from '../logo/aulogo_dk_var2_hvid.png';

export interface LeftMenuProps {
  handleNavigation: Function;
}

const LeftMenu: React.SFC<LeftMenuProps> = ({ handleNavigation }) => {
  return (
    <Menu.Item onClick={() => handleNavigation('/')}>
      <Image src={logo} size="small" style={{ height: '30px' }} />
    </Menu.Item>
  );
};

export default LeftMenu;
