import * as types from './types';

export const changeSettings = (settings) => (dispatch) => {
  dispatch({
    type: types.CHANGE_SETTINGS,
    newSettings: settings
  });
};
