import * as types from './types';
import { Dispatch } from 'redux';

export const changePicked = (picked: number[]) => async (dispatch: Dispatch) => {
  dispatch(types.CHANGE_PICKED(picked));
};
