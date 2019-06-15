import reducer, { initialState } from 'reducers/metadataReducer';
import axios from 'axios';
import * as types from 'actions/types';
import mockData from './metadataReducerMock';

describe('metadata reducer', () => {
  it('should return initialState', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle new metadata', async () => {
    const { data: metadata } = await axios.get('http://localhost:3000/api/semesters');
    const action = { type: types.FETCH_METADATA_SUCCESS, payload: metadata, timestamp: 100 };
    expect(reducer({}, action)).toEqual(mockData);
  });
});
