import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Button, Container, Divider } from 'semantic-ui-react';

class ErrorBoundary extends Component {
  state = { hasError: false };

  //eslint-disable-next-line no-unused-vars
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    //eslint-disable-next-line no-console
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container textAlign="center">
          <Divider hidden />
          <h1>Hovsa! Der er gået noget galt...</h1>
          <Button color="blue" onClick={() => (window.location.pathname = '/')}>
            Vend tilbage til forsiden ved at trykke her
          </Button>
          <Divider hidden />
          <p>
            Hvis det ikke hjælper, så prøv at slette alle cookies og browserdata, og genindlæs siden
            derefter.
          </p>
          <p>
            Hvis du har prøvet alt det ovenstående, kan du sende os en mail på{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="mailto:medmcqau@gmail.com?Subject=Error"
            >
              medmcqau@gmail.com
            </a>{' '}
            , så lover vi at vende hurtigt tilbage!
          </p>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
