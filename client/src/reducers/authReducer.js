import * as types from '../actions/types';
import _ from 'lodash';
import { createReducer } from '@reduxjs/toolkit';

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
 * createReducer er en funktion fra @reduxjs/toolkit, der laver en IMMUTABLE
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
    const { questions, privateComments, publicComments, bookmarks, answers } = action.payload;
    console.log(action.payload);

    let answersSummary = {};
    answers.forEach((a) => {
      if (!Object.prototype.hasOwnProperty.call(questions, a.question.id)) return;

      if (!Object.prototype.hasOwnProperty.call(answersSummary, a.question.id)) {
        answersSummary[a.question.id] = { history: { 1: 0, 2: 0, 3: 0 }, tries: 0, correct: 0 };
      }
      answersSummary[a.question.id].tries++;
      answersSummary[a.question.id].history[a.answer]++;

      if (questions[a.question.id].correctAnswers.indexOf(a.answer) > -1)
        answersSummary[a.question.id].correct++;
    });

    state.profile = {
      answers: answersSummary,
      bookmarks: _.keyBy(bookmarks, (a) => a.question.id),
      publicComments: _.keyBy(publicComments, (a) => a.question.id),
      privateComments: _.keyBy(privateComments, (a) => a.question.id)
    };

    state.isFetching = false;
    state.didInvalidate = false;
  }
});
