import React from 'react';

import { Container } from 'semantic-ui-react';

import Header from '../Misc/Header';
import Footer from '../Misc/Footer';
import SignupForm from './SignupForm';

const Signup = props => {
	return (
		<div className="flex-container">
			<Header />
			<Container className="content">
				<h3>Her kan du tilmelde dig</h3>
				<SignupForm />
			</Container>
			<Footer />
		</div>
	);
};

export default Signup;
