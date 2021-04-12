import React from 'react';

import { Container } from 'semantic-ui-react';

import { withLocalize, Translate, LocalizeContextProps } from 'react-localize-redux';
import errorTranslation from './404Translation.json';

/**
 * 404-page.
 */
export interface ErrorPageProps extends LocalizeContextProps {}

const ErrorPage: React.SFC<ErrorPageProps> = ({ addTranslation }) => {
  addTranslation(errorTranslation);
  return (
    <div className="flex-container">
      <Container className="content">
        <h3>
          <Translate id="404.header" />
        </h3>
        <p>
          <Translate id="404.text" />
        </p>
      </Container>
    </div>
  );
};

export default withLocalize(ErrorPage);
