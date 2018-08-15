import * as types from '../actions/types';

export default function(state = { user: null, analysedQuestions: [] }, action) {
	switch (action.type) {
		case types.AUTH_CURRENT_USER:
			return { ...state, user: action.payload };
		case types.AUTH_GET_ANSWERED_QUESTIONS:
			return { ...state, analysedQuestions: action.payload };
		default:
			return state;
	}
}
