import * as types from '../actions/types';

import { createReducer } from 'redux-starter-kit';

// qn står for QuestionNumber, og bruges i quizzen til at tjekke hvor brugeren er.
// Gemmes i redux for at beholde positionen ved pageload
const initialState = { qn: 0 };

export default createReducer(initialState, {
  [types.CHANGE_QUESTION_BY_STEP]: (state, action) => {
    state.qn = state.qn + action.payload;
  },
  [types.CHANGE_QUIZ_TO_SPECIFIC_NUMBER]: (state, action) => {
    state.qn = action.payload;
  }
});
