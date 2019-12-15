import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Specialty from 'classes/Specialty';
import Tag from 'classes/Tag';

export const initialState = {
  tags: [] as Tag[],
  specialties: [] as Specialty[],
  result: [],
  lastUpdated: 0,
  didInvalidate: false,
  isFetching: false
};

const metadataReducer = createSlice({
  name: 'metadata',
  initialState,
  reducers: {
    setMetadata: (state, action: PayloadAction<{ tags: any[]; specialties: any[] }>) => {
      state.tags = action.payload.tags;
      state.specialties = action.payload.specialties;
      state.lastUpdated = Date.now();
    }
  }
});

export default metadataReducer;
