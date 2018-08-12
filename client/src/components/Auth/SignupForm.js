import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as actions from '../../actions';

import { Form, Field } from 'react-final-form';
import { Button, Divider } from 'semantic-ui-react';

const SignupForm = props => {
	let onSubmit = async values => {
		props.signup(values).then(() => props.history.push('/login'));
	};

	let usernameAvailable = async username => {
		if (!username) {
			return 'Required!';
		} else {
			let available = await props.checkUsernameAvailability(username);

			return available ? null : 'Brugernavnet er taget';
		}
	};

	const emailValid = email => {
		const validator = new RegExp(
			"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
		);
		let res = validator.test(email);
		return res ? '' : 'Ikke en gyldig adresse';
	};

	let passwordValid = pwd => {
		if (!pwd) {
			return 'Required';
		}

		const uppercase = new RegExp('[A-Z]').test(pwd);
		const lowercase = new RegExp('[a-z]').test(pwd);
		const nums = new RegExp('[0-9]').test(pwd);
		const special = new RegExp('[^A-Za-z0-9]').test(pwd);
		const length = pwd.length >= 8;

		let validator = [uppercase, lowercase, nums, special];

		let strength = 0;
		validator.map(e => {
			if (e) strength++;
		});

		if (strength < 3 || !length) {
			return 'Skal være mindst 8 tegn og kræver mindst tre af følgende: store bogstaver, små bogstaver, tal, specielle tegn.';
		} else return null;
	};

	return (
		<Form
			onSubmit={onSubmit}
			render={({ handleSubmit, pristine, invalid }) => (
				<form onSubmit={handleSubmit} className="ui form">
					<Field name="username" validate={usernameAvailable}>
						{({ input, meta }) => (
							<div>
								<label>Username</label>
								<input
									{...input}
									type="text"
									placeholder="Username"
								/>
								{meta.error &&
									meta.touched && <span>{meta.error}</span>}
							</div>
						)}
					</Field>

					<Field name="email" validate={emailValid}>
						{({ input, meta }) => (
							<div>
								<label>Email</label>
								<input
									{...input}
									type="email"
									placeholder="Username"
								/>
								{meta.error &&
									meta.touched && <span>{meta.error}</span>}
							</div>
						)}
					</Field>

					<Field name="password" validate={passwordValid}>
						{({ input, meta }) => (
							<div>
								<label>Password</label>
								<input
									{...input}
									type="password"
									placeholder="Password"
								/>
								{meta.error &&
									meta.touched && <span>{meta.error}</span>}
							</div>
						)}
					</Field>
					<Divider hidden />
					<Button disabled={pristine || invalid}>Submit</Button>
				</form>
			)}
		/>
	);
};

function mapStateToProps(state) {
	return {
		auth: state.auth
	};
}

export default withRouter(
	connect(
		mapStateToProps,
		actions
	)(SignupForm)
);
