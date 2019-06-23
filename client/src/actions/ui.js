import * as types from './types';

export const changeSelection = (type, value) => (dispatch) => {
  dispatch({ type: types.CHANGE_SELECTION, payload: { type, value } });
};

export const uiLoading = () => ({ type: types.UI_LOADING });
export const uiDoneLoading = () => ({ type: types.UI_DONE_LOADING });
