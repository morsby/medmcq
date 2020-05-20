import React from 'react';
import { Sidebar as SemanticSidebar, Menu, Icon, Button } from 'semantic-ui-react';
import RightMenu from 'components/Layout/Menus/RightMenu';
import { Translate } from 'react-localize-redux';
import { useHistory } from 'react-router-dom';
import Notifications from 'components/Notifications/Notifications';
import { useSelector, useDispatch } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import settingsReducer from 'redux/reducers/settings';
import useWidth from 'hooks/useWidth';
import { breakpoints } from 'utils/common';

export interface SideBarProps {}

const Sidebar: React.SFC<SideBarProps> = ({ children }) => {
  const { width } = useWidth();
  const history = useHistory();
  const { rightSidebarOpen, leftSidebarOpen } = useSelector((state: ReduxState) => state.settings);
  const dispatch = useDispatch();
  const toggleSidebar = (side: 'left' | 'right', open: boolean) => {
    dispatch(settingsReducer.actions.toggleSidebar({ side, open }));
  };

  const handlePusher = () => {
    if (rightSidebarOpen) {
      toggleSidebar('right', false);
    }
    if (leftSidebarOpen) {
      toggleSidebar('left', false);
    }
  };

  return (
    <SemanticSidebar.Pushable>
      {width < breakpoints.mobile && (
        <SemanticSidebar
          as={Menu}
          animation="push"
          icon="labeled"
          inverted
          color="blue"
          onHide={() => toggleSidebar('left', false)}
          vertical
          visible={leftSidebarOpen}
          width="thin"
        >
          <Menu.Item onClick={() => toggleSidebar('left', false)}>
            <Icon name="close" inverted size="large" />
            <Translate id="header.close" />
          </Menu.Item>
          <Menu.Item onClick={() => history.push('/')}>
            <Icon name="home" />
            <Translate id="header.home" />
          </Menu.Item>
          <RightMenu sidebar />
        </SemanticSidebar>
      )}

      <SemanticSidebar
        animation="push"
        vertical
        as={Menu}
        direction="right"
        dimmed
        visible={rightSidebarOpen}
      >
        <Menu.Item>
          <Button
            size="mini"
            onClick={() => toggleSidebar('right', false)}
            fluid
            basic
            color="black"
          >
            Luk
          </Button>
        </Menu.Item>
        <Notifications />
      </SemanticSidebar>

      <SemanticSidebar.Pusher
        onClick={handlePusher}
        style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        {children}
      </SemanticSidebar.Pusher>
    </SemanticSidebar.Pushable>
  );
};

export default Sidebar;
