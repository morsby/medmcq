import axios from 'axios';
import * as types from './types';

export const getQuestions = (type, selection) => async dispatch => {
	dispatch({ type: types.IS_FETCHING });

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
	dispatch({
		type: types.FETCH_QUESTIONS,
		payload: res.data,
		questionType: type
	});
};

export const answerQuestion = (id, answer, correct) => dispatch => {
	dispatch({ type: types.ANSWER_QUESTION, payload: { id, answer, correct } });
};

export const postQuestion = post => async dispatch => {
	const formData = new FormData();

	formData.append('question', post.question);
	formData.append('answer1', post.answer1);
	formData.append('answer2', post.answer2);
	formData.append('answer3', post.answer3);
	formData.append('correctAnswer', post.correctAnswer);
	formData.append('semester', post.semester);
	formData.append('examYear', post.examYear);
	formData.append('examSeason', post.examSeason);
	formData.append('specialty', post.specialty);
	if (post.image) {
		formData.append('image', post.image, post.image.name);
	}

	const res = await axios.post('/api/questions', formData);
	dispatch({ type: types.POST_QUESTION, payload: res.data });
};
