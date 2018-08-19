import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { urls } from '../../common';

class PrivateRoute extends React.Component {
	constructor(props) {
		super(props);

		this.props.fetchUser();
	}
	render() {
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
