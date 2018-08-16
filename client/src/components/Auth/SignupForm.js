import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as actions from '../../actions';

import { Form, Field } from 'react-final-form';
import { Button, Divider, Message } from 'semantic-ui-react';

const SignupForm = props => {
	let onSubmit = async values => {
		props
			.signup(values)
			.then(props.fetchUser())
			.then(props.history.push('/login'));
	};

	let usernameAvailable = async username => {
		if (!username) {
			return 'Du skal udfylde et brugernavn!';
		} else {
			let available = await props.checkUsernameAvailability(username);

			return available ? null : 'Brugernavnet er taget';
		}
	};

	const emailValid = email => {
		if (!email) return '';
		const validator = new RegExp(
			"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
		);
		let res = validator.test(email);
		return res ? '' : 'Ikke en gyldig adresse';
	};

	let passwordValid = pwd => {
		if (!pwd) {
			return 'Du skal indtaste en adgangskode';
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
			return null;
		});

		if (strength < 3 || !length) {
			return 'Skal være mindst 8 tegn og kræver mindst tre af følgende: store bogstaver, små bogstaver, tal, specielle tegn.';
		} else return null;
	};

	let passwordRepeatValid = (pwdRepeat, allValues) => {
		if (pwdRepeat !== allValues.password) {
			return 'De to adgangskoder matcher ikke';
		} else return null;
	};

	return (
		<Form
			onSubmit={onSubmit}
			render={({ handleSubmit, pristine, invalid, values }) => {
				let firstPassword = values.password;
				return (
					<form onSubmit={handleSubmit} className="ui form custom">
						<Field name="username" validate={usernameAvailable}>
							{({ input, meta }) => (
								<div
									className={
										'field ' +
										(meta.error && meta.touched
											? 'error'
											: '')
									}
								>
									<label>Brugernavn</label>
									<input
										{...input}
										type="text"
										placeholder="Brugernavn"
									/>
									{meta.error &&
										meta.touched && (
											<Message error visible={true}>
												{meta.error}
											</Message>
										)}
								</div>
							)}
						</Field>
						<Divider hidden />
						<Field name="email" validate={emailValid}>
							{({ input, meta }) => (
								<div
									className={
										'field ' +
										(meta.error && meta.touched
											? 'error'
											: '')
									}
								>
									<label>Email</label>
									<input
										{...input}
										type="email"
										placeholder="Email"
									/>
									{meta.error &&
										meta.touched && (
											<Message error visible={true}>
												{meta.error}
											</Message>
										)}
									{meta.touched &&
										!meta.error && (
											<Message warning visible={true}>
												Du behøver ikke indtaste en
												email-adresse, men hvis du
												glemmer dine loginoplysninger
												uden den, kan du ikke få din
												bruger tilbage.
											</Message>
										)}
								</div>
							)}
						</Field>
						<Divider hidden />
						<Field name="password" validate={passwordValid}>
							{({ input, meta }) => (
								<div
									className={
										'field ' +
										(meta.error && meta.touched
											? 'error'
											: '')
									}
								>
									<label>Kodeord</label>
									<input
										{...input}
										type="password"
										placeholder="Kodeord"
									/>
									{meta.error &&
										meta.touched && (
											<Message
												error
												visible={true}
												size="small"
											>
												{meta.error}
											</Message>
										)}
								</div>
							)}
						</Field>
						<Divider hidden />
						<Field
							name="password-repeat"
							validate={passwordRepeatValid}
							bla={firstPassword}
						>
							{({ input, meta }) => (
								<div
									className={
										'field ' +
										(meta.error && meta.touched
											? 'error'
											: '')
									}
								>
									<label>Gentag kodeord</label>
									<input
										{...input}
										type="password"
										placeholder="Gentag kodeord"
									/>
									{meta.error &&
										meta.touched && (
											<Message error visible={true}>
												{meta.error}
											</Message>
										)}
								</div>
							)}
						</Field>
						<Divider hidden />
						<Button disabled={pristine || invalid}>
							Opret bruger
						</Button>
					</form>
				);
			}}
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
