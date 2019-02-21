import * as types from '../actions/types';

export default function(
    state = { feedback: [], feedbackSingle: {}, votedFor: {} },
    action
) {
    switch (action.type) {
        case types.FETCH_FEEDBACK:
            return { ...state, feedback: action.payload };
        case types.FETCH_FEEDBACK_SPECIFIC:
            return {
                ...state,
                feedbackSingle: {
                    feedback: action.payload.feedback,
                    comments: action.payload.comments,
                },
            };
        case types.VOTE_FEEDBACK:
            let { id, val } = action.payload;
            return {
                ...state,
                votedFor: { ...state.votedFor, [id]: { id, val } },
            };
        default:
            return state;
    }
}
