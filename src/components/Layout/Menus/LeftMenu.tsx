import React from 'react';
import { Menu, Image, Icon } from 'semantic-ui-react';
import logo from '../logo/aulogo_dk_var2_hvid.png';
import useWidth from 'hooks/useWidth';
import { breakpoints } from 'utils/common';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import settingsReducer from 'redux/reducers/settings';

export interface LeftMenuProps {}

const LeftMenu: React.SFC<LeftMenuProps> = () => {
  const history = useHistory();
  const { width } = useWidth();
  const dispatch = useDispatch();

  return (
    <Menu.Menu>
      {width < breakpoints.mobile && (
        <Menu.Item
          onClick={() =>
            dispatch(settingsReducer.actions.toggleSidebar({ side: 'left', open: true }))
          }
        >
          <Icon name="bars" inverted size="large" />
        </Menu.Item>
      )}

      {width > breakpoints.mobile && (
        <>
          <Menu.Item onClick={() => history.push('/')}>
            <Image src={logo} size="small" style={{ height: '30px' }} />
          </Menu.Item>
          <Menu.Item style={{ fontSize: '1.2em' }}>MedMCQ</Menu.Item>
        </>
      )}
    </Menu.Menu>
  );
};

export default LeftMenu;
