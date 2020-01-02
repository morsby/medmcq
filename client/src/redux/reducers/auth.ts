import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import User from 'classes/User';
import { Bookmark } from '../../classes/User';

const initialState = {
  user: null as User | null
};

const authReducer = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    manualCompleteSet: (state, action: PayloadAction<{ setId: number }>) => {
      const index = state.user.manualCompletedSets.findIndex(
        (completedSet) => completedSet.setId === action.payload.setId
      );
      if (index < 0) {
        // Hvis brugeren har tilføjet sættet
        state.user.manualCompletedSets.push({ setId: action.payload.setId });
      } else {
        // Hvis brugeren har fjernet sættet
        state.user.manualCompletedSets.splice(index, 1);
      }
    },
    setBookmark: (state, action: PayloadAction<Bookmark>) => {
      const index = state.user.bookmarks.findIndex(
        (bookmark) => bookmark.question.id === action.payload.question.id
      );

      if (index < 0) {
        state.user.bookmarks.push(action.payload);
      } else {
        state.user.bookmarks.splice(index, 1);
      }
    }
  }
});

export default authReducer;
