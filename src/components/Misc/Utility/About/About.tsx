import React, { useEffect } from 'react';

import { withLocalize, Translate, LocalizeContextProps } from 'react-localize-redux';
import aboutTranslations from './aboutTranslations';

import { Container, Divider, Button } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';

/**
 * Component til siden "Om-siden".
 */
export interface AboutProps extends LocalizeContextProps {}

const About: React.SFC<AboutProps> = ({ addTranslation }) => {
  const history = useHistory();

  useEffect(() => {
    addTranslation(aboutTranslations);
  }, [addTranslation]);

  return (
    <div className="flex-container">
      <Container className="content">
        <h1>
          <Translate id="about.header" />
        </h1>
        <Button basic color="green" onClick={() => history.push('/firsttime')}>
          <Translate id="about.openFirstTimeAgain" />
        </Button>

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

export default withLocalize(About);
