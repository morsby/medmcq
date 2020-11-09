import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  language: 'dk', // Hvilket sprog er valgt? kan være 'dk' eller 'gb'
  version: null as string, // App version
  firstTime: true, // Is it the users first time? Then display description modal.
  notice: { message: '', color: '' },
  maintenance: { message: '' },
  leftSidebarOpen: false,
  rightSidebarOpen: false,
  hasVoted: false
};

const settingsReducer = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    changeSettings: (
      state,
      action: PayloadAction<{ type: keyof typeof initialState; value: string | boolean }>
    ) => {
      const { type, value } = action.payload;
      (state[type] as any) = value; // Typing doesnt work here for some reason
    },
    setFirstTime: (state, action: PayloadAction<boolean>) => {
      state.firstTime = action.payload;
    },
    setNotice: (state, action: PayloadAction<{ message: string; color: string }>) => {
      state.notice = action.payload;
    },
    setMaintenance: (state, action: PayloadAction<{ message: string }>) => {
      state.maintenance = action.payload;
    },
    toggleSidebar: (state, action: PayloadAction<{ side: 'left' | 'right'; open: boolean }>) => {
      if (action.payload.side === 'left') {
        state.rightSidebarOpen = action.payload.open ? false : state.rightSidebarOpen;
        state.leftSidebarOpen = action.payload.open;
      }
      if (action.payload.side === 'right') {
        state.leftSidebarOpen = action.payload.open ? false : state.leftSidebarOpen;
        state.rightSidebarOpen = action.payload.open;
      }
    },
    toggleHasVoted: (state) => {
      state.hasVoted = !state.hasVoted
    }
  }
});

export default settingsReducer;
