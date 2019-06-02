import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Button, Container } from 'semantic-ui-react';

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
        <Container>
          <h1>Hovsa! Der er gået noget galt...</h1>
          <Button color="blue" onClick={() => (window.location = '/')}>
            Vend tilbage til forsiden ved at trykke her
          </Button>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default withRouter(ErrorBoundary);
