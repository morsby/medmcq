import React, { useEffect } from 'react';
import { withLocalize, Translate, LocalizeContextProps } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Icon, Button, Image } from 'semantic-ui-react';
import Flag from 'react-flagkit';
import { ReduxState } from 'redux/reducers';
import settingsReducer from 'redux/reducers/settings';
import User from 'classes/User';
import Notification from 'classes/Notification.class';
import { useHistory } from 'react-router-dom';
import { breakpoints } from 'utils/common';
import logo from '../logo/aulogo_hvid.png';
import useWidth from 'hooks/useWidth';

export interface RightMenuProps extends LocalizeContextProps {
  sidebar?: boolean;
}

const RightMenu: React.SFC<RightMenuProps> = ({ setActiveLanguage, languages, sidebar }) => {
  const { width } = useWidth();
  const history = useHistory();
  const dispatch = useDispatch();
  const activeLanguage = useSelector((state: ReduxState) => state.settings.language);
  const user = useSelector((state: ReduxState) => state.auth.user);
  const notifications = useSelector((state: ReduxState) =>
    state.auth.notifications.filter((n) => !n.isRead)
  );
  const semesterId = useSelector((state: ReduxState) => state.selection.semesterId);

  const changeLang = (lang: string) => {
    setActiveLanguage(lang);
    dispatch(settingsReducer.actions.changeSettings({ type: 'language', value: lang }));
  };

  const generateFlag = (lang: { code: string }) => {
    if (lang.code !== activeLanguage) {
      return (
        <Menu.Item onClick={() => changeLang(lang.code)} key={lang.code}>
          <div>
            <Flag style={{ textAlign: 'center' }} country={lang.code.toUpperCase()} size="20" />
          </div>
        </Menu.Item>
      );
    }
  };

  useEffect(() => {
    if (user) {
      setInterval(() => {
        Notification.find(semesterId);
      }, 1000 * 60);

      Notification.find(semesterId);
    }
  }, [user, semesterId]);

  if (width < breakpoints.mobile && !sidebar)
    return (
      <Menu.Item onClick={() => history.push('/')}>
        <Image src={logo} style={{ height: '30px' }} />
      </Menu.Item>
    );
  if (user) {
    return (
      <>
        {languages.map((lang) => generateFlag(lang))}
        <Menu.Item onClick={() => history.push('/profil')}>
          <strong>
            <Translate
              id="header.greeting"
              data={{
                user: user.username[0].toUpperCase() + user.username.substring(1)
              }}
            />
          </strong>
        </Menu.Item>
        <Menu.Item>
          <Icon name="thumbs up outline" /> {user.likes.length}
        </Menu.Item>
        <Menu.Item
          onClick={() =>
            dispatch(settingsReducer.actions.toggleSidebar({ side: 'right', open: true }))
          }
          style={{ cursor: 'pointer' }}
        >
          <Icon style={{ margin: '0 auto' }} name="bell outline" />
          {'  '}
          <span
            style={{
              width: '20px',
              height: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              borderRadius: '100%',
              backgroundColor: notifications.length > 0 ? 'darkred' : null
            }}
          >
            {notifications.length}
          </span>
        </Menu.Item>
        <Menu.Item>
          <Button
            inverted
            onClick={() => {
              User.logout();
              return history.push('/');
            }}
          >
            <Translate id="header.logout" />
          </Button>
        </Menu.Item>
      </>
    );
  } else {
    return (
      <>
        {languages.map((lang) => generateFlag(lang))}
        <Menu.Item onClick={() => history.push('/login')}>
          <Icon name="doctor" /> <Translate id="header.login" />
        </Menu.Item>
      </>
    );
  }
};

export default withLocalize(RightMenu);
