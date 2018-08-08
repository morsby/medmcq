import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import { Button } from 'semantic-ui-react';
import { Form, Field } from 'react-final-form';

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

class FeedbackCommentPost extends Component {
	constructor(props) {
		super(props);
		this.state = initialState;
	}

	handleSubmit = formValues => {
		formValues.feedbackId = this.props.feedbackId;
		formValues.parent_id = this.props.replyId;
		return new Promise((resolve, reject) => {
			this.props.postFeedbackComment(formValues);
			resolve();
		});
	};

	render() {
		return (
			<div>
				<Form
					onSubmit={this.handleSubmit}
					validate={values => {
						const errors = {};

						if (!values.text || values.text.length < 10) {
							errors.text = 'Teksten skal minimum være 10 tegn';
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
						<form
							onSubmit={event => {
								handleSubmit(event).then(form.reset());
							}}
							className="ui form"
						>
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
										<label>Kommentar</label>
										{this.props.replyId && (
											<p>
												Du er ved at svare på
												kommentaren med id:{' '}
												{this.props.replySlug}
											</p>
										)}
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
													<span>{meta.error}</span>
												)}
										</div>
									</div>
								)}
							</Field>

							<Button type="submit" disabled={submitting}>
								Submit
							</Button>
						</form>
					)}
				/>
			</div>
		);
	}
}

export default connect(
	null,
	actions
)(FeedbackCommentPost);
