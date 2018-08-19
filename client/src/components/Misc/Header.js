import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Container, Button } from 'semantic-ui-react';
import { urls } from '../../common';

const Header = props => {
	const handleClick = path => {
		props.history.push(urls[path]);
	};

	let text,
		user = props.auth.user;
	if (user) {
		text = (
			<div>
				Velkommen,{' '}
				<strong
					onClick={() => handleClick('profile')}
					className="click"
				>
					{user.username}
				</strong>.
			</div>
		);
	} else {
		text = <Button onClick={() => handleClick('login')}>Log ind</Button>;
	}

	return (
		<header className="main-header">
			<Container>
				<div className="header-text">{text}</div>
				{props.location.pathname !== '/' && (
					<Button floated="right" onClick={() => handleClick('root')}>
						Gå til forsiden
					</Button>
				)}
			</Container>
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
