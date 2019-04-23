import React, { useState } from 'react';
import {
  Sidebar as SemanticSidebar,
  Button,
  Segment,
  Menu,
  Icon,
  Responsive,
  Image
} from 'semantic-ui-react';
import { breakpoints } from '../../utils/common';
import styles from './Header.module.css';
import logo from './logo/aulogo_hvid.png';

const Sidebar = (props) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Responsive maxWidth={breakpoints.mobile}>
        <Menu className={styles.noprint} inverted color="blue" attached borderless={true}>
          <Menu.Item disabled={visible} onClick={() => setVisible(!visible)}>
            <Icon name="bars" inverted size="large" />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item>
              <Image src={logo} style={{ height: '30px' }} />
            </Menu.Item>
          </Menu.Menu>
        </Menu>

        <SemanticSidebar.Pushable>
          <SemanticSidebar
            as={Menu}
            animation="overlay"
            icon="labeled"
            inverted
            onHide={() => setVisible(false)}
            vertical
            visible={visible}
            width="thin"
          >
            <Menu.Item as="a">
              <Icon name="home" />
              Home
            </Menu.Item>
            <Menu.Item as="a">
              <Icon name="gamepad" />
              Games
            </Menu.Item>
            <Menu.Item as="a">
              <Icon name="camera" />
              Channels
            </Menu.Item>
          </SemanticSidebar>

          <SemanticSidebar.Pusher onClick={() => setVisible(false)} dimmed={visible}>
            {props.children}
          </SemanticSidebar.Pusher>
        </SemanticSidebar.Pushable>
      </Responsive>
      <Responsive minWidth={breakpoints.mobile}>{props.children}</Responsive>
    </>
  );
};

export default Sidebar;
