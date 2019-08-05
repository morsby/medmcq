import * as types from '../actions/types';
import { createReducer } from 'redux-starter-kit';

const initialState = {
  /**
   * Hvilket sprog er valgt? kan være 'dk' eller 'gb'
   */
  language: 'dk',

  /**
   * App version
   */
  version: '0.0.1',
  // Is it the users first time? Then display description modal.
  firstTime: true
};
/**
 * createReducer er en funktion fra redux-starter-kit, der laver en IMMUTABLE
 * version af state. Se dokumentation på: https://goo.gl/wJZmMX
 */
export default createReducer(initialState, {
  /**
   * Opdaterer settings
   * */
  [types.CHANGE_SETTINGS]: (state, action) => {
    let { type, value } = action.payload;
    state[type] = value;
  },
  [types.SET_FIRST_TIME]: (state, action) => {
    state.firstTime = action.payload;
  }
});
