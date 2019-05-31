import React from 'react';
import { withLocalize, Translate } from 'react-localize-redux';
import { Menu, Icon, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router';
import { urls } from '../../../utils/common';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import Flag from 'react-flagkit';

const RightMenu = props => {
  const { user, history, languages } = props;

  const onNavigation = path => {
    history.push(urls[path]);
  };

  const changeLang = lang => {
    props.setActiveLanguage(lang);
    props.changeSettings({ type: 'language', value: lang });
  };

  const generateFlag = lang => {
    if (lang.code !== props.activeLanguage) {
      return (
        <Menu.Item onClick={() => changeLang(lang.code)} key={lang.code}>
          <div>
            <Flag
              style={{ textAlign: 'center' }}
              country={lang.code.toUpperCase()}
              size="20"
            />
          </div>
        </Menu.Item>
      );
    }
  };

  if (user) {
    return (
      <>
        {languages.map(lang => generateFlag(lang))}
        <Menu.Item onClick={() => onNavigation('profile')}>
          <strong>
            <Translate
              id="header.greeting"
              data={{
                user:
                  user.username[0].toUpperCase() + user.username.substring(1)
              }}
            />
          </strong>
        </Menu.Item>
        <Menu.Item>
          <Button
            inverted
            onClick={() => (window.location.href = '/api/auth/logout')}
          >
            <Translate id="header.logout" />
          </Button>
        </Menu.Item>
      </>
    );
  } else {
    return (
      <>
        {languages.map(lang => generateFlag(lang))}
        <Menu.Item onClick={() => onNavigation('login')}>
          <Icon name="doctor" /> <Translate id="header.login" />
        </Menu.Item>
      </>
    );
  }
};

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    activeLanguage: state.settings.language
  };
}

export default withRouter(
  withLocalize(
    connect(
      mapStateToProps,
      actions
    )(RightMenu)
  )
);
