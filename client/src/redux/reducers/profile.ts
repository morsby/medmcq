import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Comment from 'classes/Comment';
import Profile, { Attempt } from 'classes/Profile';
import { Answer, Bookmark } from 'types/generated';

const initialState = {
  answers: [] as Answer[],
  publicComments: [] as Comment[],
  privateComments: [] as Comment[],
  bookmarks: [] as Bookmark[],
  tries: [] as Attempt[]
};

const profileReducer = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.answers = action.payload.answers;
      state.publicComments = action.payload.publicComments;
      state.privateComments = action.payload.privateComments;
      state.bookmarks = action.payload.bookmarks;
      state.tries = action.payload.tries;
    }
  }
});

export default profileReducer;
