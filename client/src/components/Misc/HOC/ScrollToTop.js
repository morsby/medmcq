import { Component } from 'react';
import { PropTypes } from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router';

/**
 * Higher Order Component der bruges til at scrolle til toppen når der ændres
 * spørgsmål i quizzen.
 */
class ScrollToTop extends Component {
  componentDidUpdate (prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render () {
    return this.props.children;
  }
}

ScrollToTop.propTypes = {
  children: PropTypes.node,
  location: ReactRouterPropTypes.location
};

export default withRouter(ScrollToTop);
