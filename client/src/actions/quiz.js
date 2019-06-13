import * as types from './types';

export const changeQuestion = (value) => (dispatch) => {
  dispatch({
    type: types.CHANGE_QUIZ_TO_SPECIFIC_NUMBER,
    payload: value
  });
};
