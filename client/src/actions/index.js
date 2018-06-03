import axios from 'axios';
import * as types from './types';

export const fetchAllQuestions = () => async dispatch => {
	const res = await axios.get('/api/questions');
	dispatch({ type: types.FETCH_ALL_QUESTIONS, payload: res.data });
};

export const answerQuestion = (id, answer, correct) => dispatch => {
	dispatch({ type: types.ANSWER_QUESTION, payload: { id, answer, correct } });
};
