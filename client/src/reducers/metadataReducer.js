import * as types from '../actions/types';
import { createReducer } from 'redux-starter-kit';
import { normalize, schema } from 'normalizr';

export const initialState = {
  entities: {},
  result: [],
  lastUpdated: 0
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
  [types.FETCH_METADATA_SUCCESS]: (state, action) => {
    return { ...normalize(action.payload, [semester]), lastUpdated: action.timestamp };
  }
});
