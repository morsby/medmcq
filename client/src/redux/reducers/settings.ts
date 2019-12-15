import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  /**
   * Hvilket sprog er valgt? kan være 'dk' eller 'gb'
   */
  language: 'dk',
  /**
   * App version
   */
  version: '0.0.1',
  // Is it the users first time? Then display description modal.
  firstTime: true
};

const settingsReducer = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    changeSettings: (state, action: PayloadAction<{ type; value }>) => {
      const { type, value } = action.payload;
      state[type] = value;
    },
    setFirstTime: (state, action: PayloadAction<boolean>) => {
      state.firstTime = action.payload;
    }
  }
});

export default settingsReducer;
