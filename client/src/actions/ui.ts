import * as types from './types';
import { getTranslate } from 'react-localize-redux';
import { Dispatch } from 'redux';
import { toast } from 'react-toastify';

export const changeSelection = (type, value) => (dispatch) => {
  dispatch({ type: types.CHANGE_SELECTION, payload: { type, value } });
};

export const makeToast = (reference: string, type: 'success' | 'error') => async (
  _dispatch: Dispatch,
  getState: Function
) => {
  let { localize } = getState();
  const translate = getTranslate(localize);

  if (type === 'success') {
    return toast.success(translate(reference));
  } else if (type === 'error') {
    return toast.error(translate(reference));
  } else {
    throw new Error('Type must be either "success" or "error"');
  }
};

export const uiLoading = () => ({ type: types.UI_LOADING });
export const uiDoneLoading = () => ({ type: types.UI_DONE_LOADING });
