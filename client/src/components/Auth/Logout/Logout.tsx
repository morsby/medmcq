import { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import * as actions from 'actions';

class Logout extends Component {
  componentDidMount() {
    this.props.fetchUser();
    this.props.history.push('/');
  }

  render() {
    return null;
  }
}

Logout.propTypes = {
  /**
   * Funktion der opdaterer login-status via redux.
   */
  fetchUser: PropTypes.func,
  history: PropTypes.func
};
export default connect(
  null,
  actions
)(Logout);
