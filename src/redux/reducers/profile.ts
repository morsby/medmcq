import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Comment from 'classes/Comment';
import Profile, { Attempt } from 'classes/Profile';
import { UserAnswer, Bookmark } from 'types/generated';
import Question from 'classes/Question';

const initialState = {
  userAnswers: [] as UserAnswer[],
  publicComments: [] as Comment[],
  privateComments: [] as Comment[],
  bookmarks: [] as Bookmark[],
  tries: [] as Attempt[],
  ignored: [] as Question[]
};

const profileReducer = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.userAnswers = action.payload.answers;
      state.publicComments = action.payload.publicComments;
      state.privateComments = action.payload.privateComments;
      state.bookmarks = action.payload.bookmarks;
      state.tries = action.payload.tries;
      state.ignored = action.payload.ignored;
    }
  }
});

export default profileReducer;
