import * as types from './types';
import axios from 'axios';
import { getQuestions } from './question';

export const changeQuestion = (value) => (dispatch) => {
  dispatch({
    type: types.QUIZ_NAVIGATE,
    payload: value
  });
};

export const startQuiz = () => (dispatch) => {
  dispatch(getQuestions({ quiz: true }));
  dispatch({ type: types.QUIZ_NAVIGATE, payload: 0 });
};

export const answerQuestion = (id, answer, correct) => (dispatch) => {
  axios.post(`/api/questions/${id}/answer`, { answer });

  dispatch({ type: types.ANSWER_QUESTION, payload: { id, answer, correct } });
};
