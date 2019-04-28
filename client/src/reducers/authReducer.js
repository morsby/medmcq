import * as types from '../actions/types';
import _ from 'lodash';
import { createReducer } from 'redux-starter-kit';

/**
 * user defaulter til null; burde måske være et tomt object (men så vil mange
 * Component-auth checks skulle skrives om, da user vil være === true)
 * Performance udregnes lidt kringlet nedenfor.
 */
const initialState = {
  user: null,
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
  [types.AUTH_PROFILE]: (state, action) => {
    // GETs full questions (from API) and the user's answers:
    let { privateComments, publicComments, bookmarks, answers } = action.payload;

    answers = answers.map(({ question, answers }) => ({
      question,
      performance: {
        tries: answers.length,
        correct: _.sumBy(answers, (answer) => answer.correct),
        answers: answers.map((answer) => answer.answer)
      }
    }));

    state.profile = {
      answers: _.groupBy(answers, (a) => a.question.examSet.semester.value),
      bookmarks: _.groupBy(bookmarks, (a) => a.examSet.semester.value),
      publicComments: _.groupBy(publicComments, (a) => a.examSet.semester.value),
      privateComments: _.groupBy(privateComments, (a) => a.examSet.semester.value)
    };
  }
});
