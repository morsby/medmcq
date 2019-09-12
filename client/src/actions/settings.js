import * as types from './types';

export const changeSettings = (settings) => (dispatch) => {
  dispatch({
    type: types.CHANGE_SETTINGS,
    payload: settings
  });
};

export const setFirstTime = (firstTime) => (dispatch) => {
  dispatch({
    type: types.SET_FIRST_TIME,
    payload: firstTime
  });
};
