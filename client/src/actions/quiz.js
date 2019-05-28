import * as types from './types';

export const changeQuestionByStep = (step) => (dispatch) => {
  dispatch({
    type: types.CHANGE_QUESTION_BY_STEP,
    payload: step
  });
};

export const changeQuestionBySpecificNumber = (value) => (dispatch) => {
  dispatch({
    type: types.CHANGE_QUIZ_TO_SPECIFIC_NUMBER,
    payload: value
  });
};
