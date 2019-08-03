import * as types from '../actions/types';
import { createReducer } from 'redux-starter-kit';
import { normalize, schema } from 'normalizr';

export const initialState = {
  entities: {},
  result: [],
  lastUpdated: 0,
  didInvalidate: false,
  isFetching: false
};

const specialty = new schema.Entity('specialties');
const tag = new schema.Entity('tags');
const examSet = new schema.Entity('examSets');
const semester = new schema.Entity('semesters', {
  specialties: [specialty],
  tags: [tag],
  examSets: [examSet]
});

export default createReducer(initialState, {
  /*
   * Siger at metadata trænger til en opdateret henting fra api'en.
   */
  [types.INVALIDATE_METADATA]: (state) => {
    state.didInvalidate = true;
    state.isFetching = false;
  },
  /*
   * Når et API-kald til at hente metadata starter
   */
  [types.FETCH_METADATA_REQUEST]: (state) => {
    state.didInvalidate = false;
    state.isFetching = true;
  },

  /*
   * Når et API-kald er succesfuldt
   */
  [types.FETCH_METADATA_SUCCESS]: (state, action) => {
    return {
      ...state,
      ...normalize(action.payload, [semester]),
      lastUpdated: action.timestamp,
      isFetching: false
    };
  },

  /*
   * Når et API-kald fejler
   */
  [types.FETCH_METADATA_FAILURE]: (state) => {
    state.isFetching = false;
  }
});
