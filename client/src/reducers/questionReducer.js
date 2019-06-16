import * as types from 'actions/types';

import { createReducer } from 'redux-starter-kit';
import { normalize, schema } from 'normalizr';

const user = new schema.Entity('users');
const publicComment = new schema.Entity('publicComments', { author: user });
const privateComment = new schema.Entity('privateComments', { author: user });
const examSet = new schema.Entity('examSets');
const question = new schema.Entity('questions', {
  examSet,
  publicComments: [publicComment],
  privateComments: [privateComment]
});

const initialState = { entities: {}, result: [], isFetching: false };

export default createReducer(initialState, {
  [types.FETCH_QUESTIONS_REQUEST]: (state) => {
    state.isFetching = true;
  },

  [types.FETCH_QUESTIONS_SUCCESS]: (state, action) => {
    const normalized = normalize(action.payload, [question]);

    return { ...state, ...normalized, isFetching: false };
  },

  [types.FETCH_QUESTIONS_FAILURE]: () => {
    return initialState;
  }
});
