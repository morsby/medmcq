import React, { useEffect } from 'react';
import { withLocalize, Translate, LocalizeContextProps } from 'react-localize-redux';

import { useDispatch, useSelector } from 'react-redux';
import { Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { urls } from '../../../../../utils/common';

import newVersionMessageTranslations from './newVersionMessageTranslations.json';

import { version } from '../../../../../version';
import { ReduxState } from 'redux/reducers';
import settingsReducer from 'redux/reducers/settings';

export interface LinkToAboutProps {}

const LinkToAbout: React.SFC<LinkToAboutProps> = () => {
  return (
    <Link to={urls.about}>
      <Translate id="newVersionOutNow.aboutLink" />
    </Link>
  );
};

export interface NewVersionMessageProps extends LocalizeContextProps {}

const NewVersionMessage: React.SFC<NewVersionMessageProps> = ({ addTranslation }) => {
  const dispatch = useDispatch();
  const prevVersion = useSelector((state: ReduxState) => state.settings.version);

  useEffect(() => {
    addTranslation(newVersionMessageTranslations);
  });

  const handleDismiss = () => {
    dispatch(settingsReducer.actions.changeSettings({ type: 'version', value: version }));
  };

  if (version !== prevVersion) {
    return (
      <div
        style={{
          position: 'fixed',
          width: '80%',
          bottom: '15px',
          left: '10%',
          zIndex: 999
        }}
      >
        <Message info onDismiss={handleDismiss} attached floating>
          <Message.Header>
            <Translate id="newVersionOutNow.header" />
          </Message.Header>
          <Translate id="newVersionOutNow.body" data={{ nav: <LinkToAbout /> }} />
        </Message>
      </div>
    );
  } else {
    return null;
  }
};

export default withLocalize(NewVersionMessage);
