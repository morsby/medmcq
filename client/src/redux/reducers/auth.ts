import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Comment from 'classes/Comment';
import Question from 'classes/Question';
import User from 'classes/User';

/**
 * user defaulter til null; burde måske være et tomt object (men så vil mange
 * Component-auth checks skulle skrives om, da user vil være === true)
 */
const initialState = {
  user: null as User | null,
  isFetching: false,
  didInvalidate: true,
  bookmarks: [] as { questionId: number }[],
  profile: {
    answers: [] as any[],
    publicComments: [] as Comment[],
    privateComments: [] as Comment[]
  }
};

const authReducer = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.bookmarks = action.payload.bookmarks.map((bookmark) => ({
        questionId: bookmark.question.id
      }));
    },
    setProfile: (
      state,
      action: PayloadAction<{
        questions: Question[];
        privateComments: Comment[];
        publicComments: Comment[];
        bookmarks;
        answers;
      }>
    ) => {
      state.profile = action.payload;
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
    setBookmark: (state, action: PayloadAction<{ questionId: number }>) => {
      const index = state.user.bookmarks.findIndex(
        (bookmark) => bookmark.question.id === action.payload.questionId
      );
      if (index < 0) {
        state.bookmarks.push({ questionId: action.payload.questionId });
      } else {
        state.bookmarks.splice(index, 1);
      }
    }
  }
});

export default authReducer;
