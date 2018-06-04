import axios from 'axios';
import * as types from './types';

export const getQuestions = (type, selection) => async dispatch => {
	// TODO: Ud fra type skal køres forskellige API-kald
	let res = { data: [] };

	if (type === 'random' && selection.length > 0) {
		// Selection er et array af id'er
		res = await axios.get(`/api/questions/${selection.join()}`);
	} else if (type === 'set') {
		// Selection er settings-props fra MCQSelector
		res = await axios.get(
			`/api/set/${selection.semester}/${selection.set}`
		);
	}
	if (res) dispatch({ type: types.FETCH_QUESTIONS, payload: res.data });
};

export const answerQuestion = (id, answer, correct) => dispatch => {
	dispatch({ type: types.ANSWER_QUESTION, payload: { id, answer, correct } });
};

export const changeSettings = (settings, prevSettings) => async dispatch => {
	let payload = { settings },
		sets = null;

	if (settings.semester) {
		const res = await axios.get('/api/count/' + settings.semester);
		let data = res.data;
		payload = { ...payload, questions: data };
	}

	dispatch({
		type: types.CHANGE_SETTINGS,
		payload
	});
};
