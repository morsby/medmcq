import * as types from './types';

export const changePicked = (picked) => async (dispatch) => {
  dispatch(types.CHANGE_PICKED(picked));
};
