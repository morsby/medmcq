import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Container, Icon } from 'semantic-ui-react';
import { urls } from '../../common';

const Header = props => {
	const handleClick = path => {
		if (path === 'login') {
			props.history.push(urls[path]);
		} else if (path === 'logout') {
			window.location.href = urls.base + '/api/auth/logout';
		}
	};

	let text,
		user = props.auth.user;
	if (user) {
		text = (
			<div>
				Velkommen, {user.username}.{' '}
				<a onClick={() => handleClick('logout')} className="click">
					Log ud
				</a>.
			</div>
		);
	} else {
		text = (
			<a onClick={() => handleClick('login')} className="click">
				Log ind
			</a>
		);
	}

	return (
		<header className="main-header">
			<Container>{text}</Container>
		</header>
	);
};

function mapStateToProps(state) {
	return {
		auth: state.auth,
		settings: state.settings
	};
}

export default withRouter(
	connect(
		mapStateToProps,
		null
	)(Header)
);
