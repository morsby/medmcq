import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Sidebar as SemanticSidebar, Menu, Icon, Image } from 'semantic-ui-react';
import { breakpoints } from '../../utils/common';
import styles from './Header.module.css';
import logo from './logo/aulogo_hvid.png';
import RightMenu from './Menus/RightMenu';
import { withRouter } from 'react-router';
import { Translate } from 'react-localize-redux';

const Sidebar = (props) => {
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWidth(window.innerWidth);
    });

    return window.removeEventListener('resize', setWidth(window.innerWidth));
  }, [window.innerWidth]);

  useEffect(() => {
    setVisible(false);
  }, [window.location.href]);

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
        animation='overlay'
        icon='labeled'
        inverted
        color='blue'
        onHide={() => setVisible(false)}
        vertical
        visible={visible}
        width='thin'
      >
        <Menu.Item onClick={() => setVisible(false)}>
          <Icon name='close' inverted size='large' />
          <Translate id='header.close' />
        </Menu.Item>
        <Menu.Item onClick={() => props.history.push('/')}>
          <Icon name='home' />
          <Translate id='header.home' />
        </Menu.Item>
        <RightMenu />
      </SemanticSidebar>

      <SemanticSidebar.Pusher
        onClick={handlePusher}
        dimmed={visible}
        style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        {width < breakpoints.mobile && (
          <Menu className={styles.noprint} inverted color='blue' attached borderless>
            <Menu.Item disabled={visible} onClick={() => setVisible(!visible)}>
              <Icon name='bars' inverted size='large' />
            </Menu.Item>
            <Menu.Menu position='right'>
              <Menu.Item onClick={() => props.history.push('/')}>
                <Image src={logo} style={{ height: '30px' }} />
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        )}

        {props.children}
      </SemanticSidebar.Pusher>
    </SemanticSidebar.Pushable>
  );
};

Sidebar.propTypes = {
  history: ReactRouterPropTypes.history,
  children: PropTypes.node
};

export default withRouter(Sidebar);
