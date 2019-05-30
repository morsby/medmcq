import React from 'react';

import { Placeholder, Container } from 'semantic-ui-react';

/**
 * Loading page. Bruges mens data hentes på visse sider, fx profil, feedback.
 */
const LoadingPage = () => (
  <Container>
    <Placeholder fluid>
      <Placeholder.Header>
        <Placeholder.Line />
        <Placeholder.Line />
      </Placeholder.Header>
      <Placeholder.Paragraph>
        <Placeholder.Line />
        <Placeholder.Line />
        <Placeholder.Line />
        <Placeholder.Line />
      </Placeholder.Paragraph>
    </Placeholder>
  </Container>
);

export default LoadingPage;
