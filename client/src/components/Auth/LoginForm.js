import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as actions from '../../actions';

import { Form, Field } from 'react-final-form';
import { Button, Divider, Message } from 'semantic-ui-react';

class LoginForm extends Component {
	constructor(props) {
		super(props);

		this.state = { error: null };
	}

	onSubmit = async values => {
		let login = await this.props.login(values);
		if (login.type === 'success') {
			this.props.history.push('/');
		} else {
			this.setState({ error: 'Login mislykkedes' });
		}
	};

	usernameValid = async username => {
		if (!username) {
			return 'Required!';
		}
		return null;
	};

	passwordValid = pwd => {
		if (!pwd) {
			return 'Required';
		}
		return null;
	};

	render() {
		return (
			<Form
				onSubmit={this.onSubmit}
				render={({ handleSubmit, pristine, invalid }) => (
					<form onSubmit={handleSubmit} className="ui form">
						<Field name="username" validate={this.usernameValid}>
							{({ input, meta }) => (
								<div>
									<label>Username</label>
									<input
										{...input}
										type="text"
										placeholder="Username"
									/>
									{meta.error &&
										meta.touched && (
											<span>{meta.error}</span>
										)}
								</div>
							)}
						</Field>

						<Field name="password" validate={this.passwordValid}>
							{({ input, meta }) => (
								<div>
									<label>Password</label>
									<input
										{...input}
										type="password"
										placeholder="Password"
									/>
									{meta.error &&
										meta.touched && (
											<span>{meta.error}</span>
										)}
								</div>
							)}
						</Field>
						{this.state.error && (
							<Message negative>{this.state.error}</Message>
						)}
						<Divider hidden />
						<Button disabled={pristine || invalid}>Submit</Button>
					</form>
				)}
			/>
		);
	}
}

function mapStateToProps(state) {
	return {
		auth: state.auth
	};
}

export default withRouter(
	connect(
		mapStateToProps,
		actions
	)(LoginForm)
);
