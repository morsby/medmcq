import React from 'react';

import { Container, Button } from 'semantic-ui-react';

import Header from '../Misc/Header';
import Footer from '../Misc/Footer';
import LoginForm from './LoginForm';

const Login = props => {
	return (
		<div className="flex-container">
			<Header />
			<Container className="content">
				<h3>Log ind</h3>
				<LoginForm />
			</Container>
			<a href="/api/logout">Log ud</a>
			<Footer />
		</div>
	);
};

export default Login;
