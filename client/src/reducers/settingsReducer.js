import * as types from '../actions/types';
import _ from 'lodash';
import { createReducer } from 'redux-starter-kit';

const initialState = {
  /**
   * Hvilket sprog er valgt? kan være 'dk' eller 'gb'
   */
  language: 'dk',

  /**
   * App version
   */
  version: '0.0.1'
};
/**
 * createReducer er en funktion fra redux-starter-kit, der laver en IMMUTABLE
 * version af state. Se dokumentation på: https://goo.gl/wJZmMX
 */
export default createReducer(initialState, {
  /**
   * Bliver kaldt i starten af et API-request til serveren efter spørgsmål til
   * quizzen.
   *
   * Her tjekkes, om vi LIGE har hentet spørgsmål (og dette dispatch blev
   * overhalet indenom af selve FETCH_QUESTIONS).
   */
  [types.IS_FETCHING]: (state) => {
    state.isFetching = Date.now() - state.lastFetch > 1000 ? true : false;
  },

  /**
   * Bliver kaldt, når der er modtaget spørgsmål fra API'en.
   * Fortæller siden, at nu er spørgsmålene hentet.
   * Selve spørgsmålene behandles i questionsReducer.js
   */
  [types.FETCH_QUESTIONS]: (state) => {
    state.isFetching = false;
    state.lastFetch = Date.now();
  }
});
