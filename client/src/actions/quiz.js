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

export const answerQuestion = (id, answer, correct, semester, user = null) => (dispatch) => {
  let post = {
    questionId: id,
    answer: correct ? 'correct' : 'wrong',
    answerNo: answer,
    semester
  };
  if (user) axios.post('/api/questions/answer', post);

  dispatch({ type: types.ANSWER_QUESTION, payload: { id, answer, correct } });
  dispatch({
    type: types.AUTH_UPDATE_USER_ANSWERS,
    payload: { semester, id, correct }
  });
};
