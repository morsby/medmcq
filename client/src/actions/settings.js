import axios from 'axios';
import * as types from './types';

export const changeSettings = (settings, prevSettings) => async dispatch => {
	let payload = { settings };

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
