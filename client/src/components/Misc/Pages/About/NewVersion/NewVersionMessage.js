import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withLocalize, Translate } from 'react-localize-redux';

import { connect } from 'react-redux';
import * as actions from '../../../../../actions';
import { Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { urls } from '../../../../../utils/common';

import newVersionMessageTranslations from './newVersionMessageTranslations.json';

import { version } from '../../../../../version';

const LinkToAbout = () => (
  <Link to={urls.about}>
    <Translate id="newVersionOutNow.aboutLink" />
  </Link>
);

const NewVersionMessage = ({ addTranslation, prev_version, changeSettings }) => {
  useEffect(() => {
    addTranslation(newVersionMessageTranslations);
  });

  const handleDismiss = () => {
    changeSettings({ type: 'version', value: version });
  };

  if (version !== prev_version) {
    return (
      <div style={{ position: 'fixed', width: '80%', bottom: '15px', left: '10%', zIndex: '999' }}>
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

NewVersionMessage.propTypes = {
  version: PropTypes.string,
  changeSettings: PropTypes.func,
  addTranslation: PropTypes.func
};

const mapStateToProps = (state) => ({
  prev_version: state.settings.version
});

export default withLocalize(
  connect(
    mapStateToProps,
    actions
  )(NewVersionMessage)
);
