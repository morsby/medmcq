import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import { Container, Message, Button, Divider } from 'semantic-ui-react';
import { Form, Field } from 'react-final-form';

import Header from '../Misc/Header';
import Footer from '../Misc/Footer';

class ResetPassword extends Component {
	state = { message: null };

	onSubmit = async values => {
		let token = this.props.match.params.token;
		await this.props.resetPassword(token, values, data => {
			this.setState({ message: data });
		});
	};

	passwordValid = pwd => {
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

	passwordRepeatValid = (pwdRepeat, allValues) => {
		if (pwdRepeat !== allValues.password) {
			return 'De to adgangskoder matcher ikke';
		} else return null;
	};

	render() {
		let { message } = this.state;
		return (
			<div className="flex-container">
				<Header />
				<Container className="content">
					<h3>Indtast dit nye kodeord</h3>
					<Form
						onSubmit={this.onSubmit}
						render={({
							handleSubmit,
							pristine,
							invalid,
							values,
							form
						}) => {
							return (
								<form
									onSubmit={event => {
										handleSubmit(event).then(form.reset());
									}}
									className="ui form custom"
								>
									<Field
										name="password"
										validate={this.passwordValid}
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
										validate={this.passwordRepeatValid}
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
														<Message
															error
															visible={true}
														>
															{meta.error}
														</Message>
													)}
											</div>
										)}
									</Field>
									{message && (
										<Message
											negative={message.type === 'error'}
											positive={
												message.type === 'success'
											}
										>
											{message.data}
										</Message>
									)}
									<Divider hidden />
									<Button disabled={pristine || invalid}>
										Skift kodeord
									</Button>
								</form>
							);
						}}
					/>
				</Container>
				<Footer />
			</div>
		);
	}
}

export default connect(
	null,
	actions
)(ResetPassword);
