import * as types from '../actions/types';
import _ from 'lodash';

import { createReducer } from 'redux-starter-kit';

/**
 * initialState er et tomt object i et array.
 * Det fyldes op med spørgsmål opbygget som i models/question.js
 */
const initialState = [[]];

/**
 * createReducer er en funktion fra redux-starter-kit, der laver en IMMUTABLE
 * version af state. Se dokumentation på: https://goo.gl/wJZmMX
 */
export default createReducer(initialState, {
  [types.FETCH_QUESTIONS]: (state, action) => {
    let qs = action.payload;
    // Shuffle questions if not in set
    if (action.questionType === 'specialer' || action.questionType === 'random') {
      qs = _.shuffle(qs);
    }
    return qs || false;
  },
  [types.ANSWER_QUESTION]: (state, action) => {
    /**
     * Find det spørgsmål i array'et der har det rette id, opdater svaret
     */
    const index = _.findIndex(state, { _id: action.payload.id });
    const q = state[index];
    q.answer = action.payload.answer;
  },
  [types.QUESTION_COMMENT_UPDATE]: (state, action) => {
    /**
     * Find det id i arrayet og erstat kommentarerne.
     * Benyttes både ved ny kommentar, ændret kommentar
     * og slettet kommentar.
     *
     * Virker ved at API'en returnerer det opdaterede spørgsmål.
     */
    const { _id, comments } = action.payload.question;
    const index = _.findIndex(state, { _id });

    state[index].comments = comments;
  },
  [types.QUESTION_SPECIALTY_UPDATE]: (state, action) => {
    /**
     * Find det id i arrayet og erstat specialerne.
     */
    const { _id, newSpecialties, newTags } = action.payload;
    console.log(action.payload);

    const index = _.findIndex(state, { _id });

    state[index].newSpecialties = newSpecialties;
    state[index].newTags = newTags;
  }
});
