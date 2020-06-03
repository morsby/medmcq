import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import User from 'classes/User';
import { Bookmark } from 'types/generated';
import Notification from 'classes/Notification.class';
import { insertOrReplace } from 'utils/common';

const initialState = {
  user: null as User | null,
  notifications: [] as Notification[]
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
    manualCompleteSet: (state, action: PayloadAction<{ examSetId: number }>) => {
      const index = state.user.manualCompletedSets.findIndex(
        (completedSet) => completedSet.examSetId === action.payload.examSetId
      );
      if (index < 0) {
        // Hvis brugeren har tilføjet sættet
        state.user.manualCompletedSets.push({ examSetId: action.payload.examSetId });
      } else {
        // Hvis brugeren har fjernet sættet
        state.user.manualCompletedSets.splice(index, 1);
      }
    },
    addOrRemoveBookmark: (state, action: PayloadAction<Bookmark>) => {
      const index = state.user.bookmarks.findIndex(
        (bookmark) => bookmark.question.id === action.payload.question.id
      );

      if (index < 0) {
        state.user.bookmarks.push(action.payload);
      } else {
        state.user.bookmarks.splice(index, 1);
      }
    },
    addNotifications: (state, action: PayloadAction<Notification[] | Notification>) => {
      insertOrReplace(state.notifications, action.payload);
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
    }
  }
});

export default authReducer;
