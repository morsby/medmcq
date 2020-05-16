import React, { useState, useEffect } from 'react';
import { Sidebar as SemanticSidebar, Menu, Icon, Image } from 'semantic-ui-react';
import styles from './Header.module.css';
import logo from './logo/aulogo_hvid.png';
import RightMenu from 'components/Layout/Menus/RightMenu';
import { Translate } from 'react-localize-redux';
import { useHistory } from 'react-router-dom';

export interface SideBarProps {}

const Sidebar: React.SFC<SideBarProps> = ({ children }) => {
  const history = useHistory();
  const [visible, setVisible] = useState(false);

  const handleNavigation = (url: string) => {
    setVisible(false);
    history.push(url);
  };

  useEffect(() => {
    setVisible(false);
  }, []);

  const handlePusher = () => {
    if (visible) {
      return setVisible(false);
    } else {
      return null;
    }
  };

  return (
    <SemanticSidebar.Pushable>
      <SemanticSidebar
        as={Menu}
        animation="overlay"
        icon="labeled"
        inverted
        color="blue"
        onHide={() => setVisible(false)}
        vertical
        visible={visible}
        width="thin"
      >
        <Menu.Item onClick={() => setVisible(false)}>
          <Icon name="close" inverted size="large" />
          <Translate id="header.close" />
        </Menu.Item>
        <Menu.Item onClick={() => handleNavigation('/')}>
          <Icon name="home" />
          <Translate id="header.home" />
        </Menu.Item>
        <RightMenu handleNavigation={handleNavigation} />
      </SemanticSidebar>

      <SemanticSidebar.Pusher
        onClick={handlePusher}
        dimmed={visible}
        style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        <Menu className={styles.noprint} inverted color="blue" attached borderless>
          <Menu.Item disabled={visible} onClick={() => setVisible(!visible)}>
            <Icon name="bars" inverted size="large" />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item onClick={() => handleNavigation('/')}>
              <Image src={logo} style={{ height: '30px' }} />
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        {children}
      </SemanticSidebar.Pusher>
    </SemanticSidebar.Pushable>
  );
};

export default Sidebar;
