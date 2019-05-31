import * as types from '../actions/types';

import { createReducer } from 'redux-starter-kit';

// qn står for QuestionNumber, og bruges i quizzen til at tjekke hvor brugeren er.
// Gemmes i redux for at beholde positionen ved pageload
const initialState = { sets: false };

export default createReducer(initialState, {
  [types.LOAD_SETS]: (state, action) => {
    state.sets = true;
  },
  [types.LOAD_SETS_FINISH]: (state, action) => {
    state.sets = false;
  }
});
