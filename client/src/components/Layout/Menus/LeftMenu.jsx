import React from 'react';
import { Menu, Image } from 'semantic-ui-react';
import { withRouter } from 'react-router';
import logo from '../logo/aulogo_dk_var2_hvid.png';
import { urls } from '../../../utils/common';

const LeftMenu = ({ history }) => {
  const onNavigation = (path) => {
    history.push(urls[path]);
  };

  return (
    <Menu.Item onClick={() => onNavigation('root')}>
      <Image src={logo} size="small" style={{ height: '30px' }} />
    </Menu.Item>
  );
};

export default withRouter(LeftMenu);
