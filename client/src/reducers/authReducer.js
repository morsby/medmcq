import * as types from '../actions/types';

export default function(state = { user: null }, action) {
	switch (action.type) {
		case types.AUTH_CURRENT_USER:
			return { ...state, user: action.payload };
		default:
			return state;
	}
}
