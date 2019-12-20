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
  profile: {
    answers: [] as any[],
    bookmarks: [] as any[],
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
    },
    setProfile: (
      state,
      action: PayloadAction<{
        questions: Question[];
        privateComments: Comment[];
        publicComments;
        bookmarks;
        answers;
      }>
    ) => {
      state.profile = action.payload;
    }
  }
});

export default authReducer;
