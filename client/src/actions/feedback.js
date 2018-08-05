import axios from 'axios';
import * as types from './types';

export const fetchFeedback = () => async dispatch => {
	const res = await axios.get('/api/feedback/');
	let data = res.data;

	dispatch({
		type: types.FETCH_FEEDBACK,
		payload: data
	});
};

export const fetchFeedbackSpecific = id => async dispatch => {
	const res = await axios.get(`/api/feedback/${id}`);
	let data = res.data;

	dispatch({
		type: types.FETCH_FEEDBACK_SPECIFIC,
		payload: data
	});
};

export const postFeedback = (post, callback) => async dispatch => {
	const res = await axios.post('/api/feedback', post);

	dispatch({ type: types.POST_FEEDBACK, payload: res.data });
	callback(res.data.id);
};

export const postFeedbackComment = post => dispatch => {
	axios
		.post(`/api/feedback/${post.feedbackId}/comment`, post)
		.then(dispatch(fetchFeedbackSpecific(post.feedbackId)));
};

export const voteFeedback = (id, val) => async dispatch => {
	const res = await axios.put(`/api/feedback/${id}/vote`, { val });

	dispatch({ type: types.VOTE_FEEDBACK, payload: res.data });
	dispatch(fetchFeedbackSpecific(id));
};
