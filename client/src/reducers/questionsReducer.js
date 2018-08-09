import * as types from '../actions/types';
import _ from 'lodash';

export default function(state = [], action) {
	switch (action.type) {
		case types.FETCH_QUESTIONS:
			let questions = action.payload;
			// Shuffle questions if not in set
			if (
				action.questionType === 'specialer' ||
				action.questionType === 'random'
			) {
				questions = _.shuffle(questions);
			}
			return questions || false;
		case types.ANSWER_QUESTION:
			let newState = [...state];

			let q = _.findIndex(newState, { _id: action.payload.id });
			newState[q].answer = action.payload.answer;
			return newState;

		default:
			return state;
	}
}
