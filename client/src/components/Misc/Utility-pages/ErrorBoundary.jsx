import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Button, Container, Divider } from 'semantic-ui-react';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.log(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container textAlign="center">
          <Divider hidden />
          <h1>Hovsa! Der er gået noget galt...</h1>
          <Button color="blue" onClick={() => (window.location = '/')}>
            Vend tilbage til forsiden ved at trykke her
          </Button>
          <Divider hidden />
          <p>
            Hvis det ikke hjælper, så prøv at slette alle cookies og browserdata, og genindlæs siden
            derefter.
          </p>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default withRouter(ErrorBoundary);
