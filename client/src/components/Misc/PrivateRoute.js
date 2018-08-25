import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { urls } from '../../utils/common';

import LoadingPage from './LoadingPage';

class PrivateRoute extends React.Component {
	constructor(props) {
		super(props);

		this.state = { loading: true };

		this.props.fetchUser().then(() => this.setState({ loading: false }));
	}
	render() {
		if (this.state.loading) return <LoadingPage />;
		if (!this.props.auth.user) {
			return <Redirect to={urls.login} />;
		}
		return <Route {...this.props} />;
	}
}

function mapStateToProps(state) {
	return { auth: state.auth };
}

export default connect(
	mapStateToProps,
	actions
)(PrivateRoute);
