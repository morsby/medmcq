import * as types from './types';

export const changeSelection = (type, value) => (dispatch) => {
  dispatch({ type: types.CHANGE_SELECTION, payload: { type, value } });
};
