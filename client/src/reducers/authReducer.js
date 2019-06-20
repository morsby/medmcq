import * as types from '../actions/types';
import _ from 'lodash';
import { createReducer } from 'redux-starter-kit';

/**
 * user defaulter til null; burde måske være et tomt object (men så vil mange
 * Component-auth checks skulle skrives om, da user vil være === true)
 */
const initialState = {
  user: null,
  isFetching: false,
  profile: {
    answers: {},
    bookmarks: {},
    publicComments: {},
    privateComments: {}
  }
};

/**
 * createReducer er en funktion fra redux-starter-kit, der laver en IMMUTABLE
 * version af state. Se dokumentation på: https://goo.gl/wJZmMX
 */
export default createReducer(initialState, {
  [types.AUTH_CURRENT_USER]: (state, action) => {
    // Modtages en bruger? Ellers sender vi null
    let user = action.payload ? action.payload : null;

    state.user = user;
    if (!user) state.profile = initialState.profile;
  },

  [types.AUTH_PROFILE_REQUEST]: (state) => {
    state.isFetching = true;
  },

  [types.AUTH_PROFILE_SUCCESS]: (state, action) => {
    let { privateComments, publicComments, bookmarks, answers } = action.payload;
    let answersSummary = {};
    answers.forEach((a) => {
      answersSummary[a.questionId] = { 1: 0, 2: 0, 3: 0 };
      answersSummary[a.questionId][a.answer]++;
    });
    state.isFetching = false;
    state.profile = {
      answers: answersSummary,
      bookmarks: _.keyBy(bookmarks, (a) => a.questionId),
      publicComments: _.keyBy(publicComments, (a) => a.questionId),
      privateComments: _.keyBy(privateComments, (a) => a.questionId)
    };
  }
});
