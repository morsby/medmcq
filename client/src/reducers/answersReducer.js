import * as types from '../actions/types';

export default function(state = [], action) {
    switch (action.type) {
        case types.FETCH_QUESTIONS:
            return [];

        case types.ANSWER_QUESTION:
            let newState = [...state];

            newState[action.payload.correct.qn] =
                action.payload.correct.correct;

            return newState;
        default:
            return state;
    }
}
