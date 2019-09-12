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
  didInvalidate: true,
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
  [types.AUTH_FETCH_USER_REQUEST]: (state) => {
    state.isFetching = true;
  },
  [types.AUTH_FETCH_USER_SUCCESS]: (state, action) => {
    // Modtages en bruger? Ellers sender vi null
    let user = action.payload ? action.payload : null;

    state.user = user;
    state.isFetching = false;
    if (!user) state.profile = initialState.profile;
  },

  [types.AUTH_PROFILE_REQUEST]: (state) => {
    state.isFetching = true;
  },
  [types.FETCH_QUESTIONS_REQUEST]: (state) => {
    state.didInvalidate = true;
  },

  [types.AUTH_PROFILE_SUCCESS]: (state, action) => {
    let { privateComments, publicComments, bookmarks, answers, questions } = action.payload;

    let answersSummary = {};
    answers.forEach((a) => {
      if (!questions.hasOwnProperty(a.questionId)) return;

      if (!answersSummary.hasOwnProperty(a.questionId)) {
        answersSummary[a.questionId] = { history: { 1: 0, 2: 0, 3: 0 }, tries: 0, correct: 0 };
      }

      answersSummary[a.questionId].tries++;
      answersSummary[a.questionId].history[a.answer]++;
      if (questions[a.questionId].correctAnswers.indexOf(a.answer) > -1)
        answersSummary[a.questionId].correct++;
    });
    state.profile = {
      answers: answersSummary,
      bookmarks: _.keyBy(bookmarks, (a) => a.questionId),
      publicComments: _.keyBy(publicComments, (a) => a.questionId),
      privateComments: _.keyBy(privateComments, (a) => a.questionId)
    };
    state.isFetching = false;
    state.didInvalidate = false;
  }
});
