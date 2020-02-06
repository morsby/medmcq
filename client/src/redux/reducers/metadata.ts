import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Semester from 'classes/Semester';

export const initialState = {
  semesters: [] as Semester[],
  result: [],
  lastUpdated: 0,
  didInvalidate: false,
  isFetching: false
};

const metadataReducer = createSlice({
  name: 'metadata',
  initialState,
  reducers: {
    setSemesters: (state, action: PayloadAction<Semester[]>) => {
      state.semesters = action.payload;
    }
  }
});

export default metadataReducer;
