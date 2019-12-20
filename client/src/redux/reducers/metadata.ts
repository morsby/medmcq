import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Specialty from 'classes/Specialty';
import Tag from 'classes/Tag';
import Semester from 'classes/Semester';
import ExamSet from 'classes/ExamSet';

export const initialState = {
  tags: [] as Tag[],
  specialties: [] as Specialty[],
  semesters: [] as Semester[],
  examSets: [] as ExamSet[],
  result: [],
  lastUpdated: 0,
  didInvalidate: false,
  isFetching: false
};

const metadataReducer = createSlice({
  name: 'metadata',
  initialState,
  reducers: {
    setMetadata: (
      state,
      action: PayloadAction<{ tags: Tag[]; specialties: Specialty[]; examSets: ExamSet[] }>
    ) => {
      state.tags = action.payload.tags;
      state.specialties = action.payload.specialties;
      state.examSets = action.payload.examSets;
      state.lastUpdated = Date.now();
    },
    setSemesters: (state, action: PayloadAction<Semester[]>) => {
      state.semesters = action.payload;
    }
  }
});

export default metadataReducer;
