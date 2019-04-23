import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { withLocalize, Translate } from 'react-localize-redux';
import aboutTranslations from './aboutTranslations';

import { Container, Message, Divider } from 'semantic-ui-react';

/**
 * Component til siden "Om-siden".
 */
const About = ({ addTranslation }) => {
  addTranslation(aboutTranslations);

  return (
    <div className="flex-container">
      <Container className="content">
        <h1>
          <Translate id="about.header" />
        </h1>
        <Message warning>
          <Message.Header>
            <Translate id="about.notice.header" />
          </Message.Header>
          <Translate id="about.notice.body" />
        </Message>

        <h2>
          <Translate id="changelog.header" />
        </h2>
        <Translate id="changelog.body" />

        <h2>
          <Translate id="voting.header" />
        </h2>
        <Translate id="voting.body" />

        <h2>
          <Translate id="about.privacy.header" />
        </h2>
        <Translate id="about.privacy.body" />
      </Container>
      <Divider hidden />
    </div>
  );
};

About.propTypes = {
  /**
   * History
   * fra react-router
   */
  history: ReactRouterPropTypes.history,
  /**
   * Func til at tilføje oversættelse.
   * Fra react-localize-redux
   */
  addTranslation: PropTypes.func
};

export default withLocalize(About);
