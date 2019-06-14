import * as types from './types';

export const changeQuestion = (value) => (dispatch) => {
  dispatch({
    type: types.QUIZ_NAVIGATE,
    payload: value
  });
};
