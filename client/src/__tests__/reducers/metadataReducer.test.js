import reducer, { initialState } from 'reducers/metadataReducer';

describe('metadata reducer', () => {
  it('should return initialState', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });
});
