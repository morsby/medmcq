import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import { Container, Button } from 'semantic-ui-react';
import { Form, Field } from 'react-final-form';

import FeedbackNavigation from './FeedbackNavigation';
import FeedbackSingleContent from './FeedbackSingleContent';
import Header from '../Misc/Header';
import Footer from '../Misc/Footer';

let initialState = {
	title: '',
	text: '',
	errors: {
		title: '',
		text: ''
	},
	titleValid: false,
	textValid: false,
	formValid: false,
	displayErr: false
};

class FeedbackPost extends Component {
	constructor(props) {
		super(props);
		this.state = initialState;
	}

	handleSubmit = formValues => {
		this.props.postFeedback(formValues, id => {
			setTimeout(this.props.history.push('/feedback/' + id), 50);
		});
	};

	render() {
		return (
			<div className="flex-container">
				<Header />
				<Container className="content">
					<FeedbackNavigation />
					<Form
						onSubmit={this.handleSubmit}
						validate={values => {
							const errors = {};
							if (!values.title || values.title.length < 3) {
								errors.title =
									'Titlen skal minimum være 3 tegn';
							}

							if (!values.text || values.text.length < 10) {
								errors.text =
									'Teksten skal minimum være 10 tegn';
							}
							return errors;
						}}
						render={({
							handleSubmit,
							submitting,
							pristine,
							values,
							form
						}) => (
							<form onSubmit={handleSubmit} className="ui form">
								<Field name="title">
									{({ input, meta }) => (
										<div
											className={
												'field ' +
												(meta.error && meta.touched
													? 'error'
													: '')
											}
										>
											<label>Titel</label>
											<input
												{...input}
												type="text"
												placeholder="Titel"
											/>
											<div className="form-error">
												{meta.error &&
													meta.touched && (
														<span>
															{meta.error}
														</span>
													)}
											</div>
										</div>
									)}
								</Field>

								<Field name="text">
									{({ input, meta }) => (
										<div
											className={
												'field ' +
												(meta.error && meta.touched
													? 'error'
													: '')
											}
										>
											<label>Forslag</label>
											<div className="ui info message mini form-explanation">
												<a
													href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet"
													target="_blank"
													rel="noopener noreferrer"
												>
													Markdown-formattering
												</a>{' '}
												er undersøttet
											</div>
											<textarea
												{...input}
												placeholder="Forslag"
											/>

											<div className="form-error">
												{meta.error &&
													meta.touched && (
														<span>
															{meta.error}
														</span>
													)}
											</div>
										</div>
									)}
								</Field>

								<Button type="submit" disabled={submitting}>
									Submit
								</Button>

								<h4>
									Sådan her kommer dit forslag til at se ud:
								</h4>
								<FeedbackSingleContent
									title={values.title || 'Titel'}
									date={new Date()}
									text={values.text || 'Forslag'}
								/>
							</form>
						)}
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
)(FeedbackPost);
