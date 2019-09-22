import * as types from '../actions/types';
import _ from 'lodash';

import { createReducer } from 'redux-starter-kit';

/**
 * initialState er et tomt object i et array.
 * Det fyldes op med spørgsmål opbygget som i models/question.js
 */
const initialState = {
  questions: [],
  answers: {},
  quizId: null,
  currentQuestion: 0,
  didInvalidate: false
};

/**
 * createReducer er en funktion fra redux-starter-kit, der laver en IMMUTABLE
 * version af state. Se dokumentation på: https://goo.gl/wJZmMX
 */
export default createReducer(initialState, {
  [types.FETCH_QUESTIONS_SUCCESS]: (state, action) => {
    if (action.quiz) {
      state.questions = action.payload.map((q) => q.id);
      console.log(action);
      if (!action.refetch) {
        state.currentQuestion = 0;
        state.answers = {};
      }
      state.didInvalidate = false;
    } else {
      // Hvis vi henter nogle spørgsmål, der ikke hører til quizzen, gør
      // vi quizzen invalid, så Quiz.tsx ved, at den skal bede om at genhente
      // spørgsmålene.
      state.didInvalidate = true;
    }
  },

  [types.ANSWER_QUESTION]: (state, action) => {
    /**
     * Find det spørgsmål i array'et der har det rette id, opdater svaret
     */
    state.answers[action.payload.id] = action.payload.answer;
  },

  [types.QUESTION_COMMENT_UPDATE]: (state, action) => {
    /**
     * Find det id i arrayet og erstat kommentarerne.
     * Benyttes både ved ny kommentar, ændret kommentar
     * og slettet kommentar.
     *
     * Virker ved at API'en returnerer det opdaterede spørgsmål.
     */
    const { id, comments } = action.payload.question;
    const index = _.findIndex(state.questions, { id });

    state.questions[index].comments = comments;
  },
  [types.QUESTION_SPECIALTY_UPDATE]: (state, action) => {
    /**
     * Find det id i arrayet og erstat specialerne.
     */
    const { id, specialty, votes, tags, tagVotes } = action.payload;
    const index = _.findIndex(state.questions, { id });

    state.questions[index].specialty = specialty;
    state.questions[index].votes = votes;
    state.questions[index].tags = tags;
    state.questions[index].tagVotes = tagVotes;
  },
  [types.QUIZ_NAVIGATE]: (state, action) => {
    state.currentQuestion = action.payload;
  }
});
