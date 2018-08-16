import * as types from '../actions/types';

import _ from 'lodash';

export default function(
	state = {
		user: null,
		performance: {
			answeredQuestions: {},
			summary: { allRight: [], allWrong: [], mixed: [] }
		}
	},
	action
) {
	switch (action.type) {
		case types.AUTH_CURRENT_USER:
			return { ...state, user: action.payload };
		case types.AUTH_GET_ANSWERED_QUESTIONS:
			// GETs full questions (from API) and the user's answers:
			let { questions, answers } = action;

			// Creates a new object with key = question._id combining the two
			let answeredQuestions = {};
			questions.map(e => {
				answeredQuestions[e._id] = e;
				_.set(answeredQuestions, [e._id], {
					...answeredQuestions[e._id],
					userAnswers: answers[e._id]
				});
				return null;
			});

			// Loops over all answers, generating a summary
			let allRight = [],
				allWrong = [],
				mixed = [];

			let ids = Object.keys(answers);

			ids.map(id => {
				let answer = answers[id];

				if (answer.correct > 0 && answer.wrong === 0) {
					allRight.push(id);
				} else if (answer.correct === 0 && answer.wrong > 0) {
					allWrong.push(id);
				} else if (answer.correct > 0 && answer.wrong > 0) {
					mixed.push(id);
				}
				return null;
			});

			let summary = Object.assign({}, { allRight, allWrong, mixed });
			return { ...state, performance: { answeredQuestions, summary } };

		default:
			return state;
	}
}
