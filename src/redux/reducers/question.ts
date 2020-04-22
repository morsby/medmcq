import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Question from 'classes/Question';
import Comment from 'classes/Comment';
import _ from 'lodash';
import { insertOrReplace } from 'utils/common';
import { TagVote, SpecialtyVote } from 'types/generated';

const initialState = {
  questions: [] as Question[],
  comments: [] as Comment[],
  isFetching: false,
  isEditing: false
};

const questionsReducer = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      const questions = _.uniqBy(action.payload, (question) => question.id); // Prevents duplicates
      state.questions = questions;

      let comments: Comment[] = [];
      let tagVotes: TagVote[] = [];
      let specialtyVotes: SpecialtyVote[] = [];
      for (let question of action.payload) {
        comments = comments.concat([...question.publicComments, ...question.privateComments]);
        specialtyVotes = specialtyVotes.concat(question.specialtyVotes);
        tagVotes = tagVotes.concat(question.tagVotes);
      }

      state.comments = comments;
    },
    addQuestion: (state, action: PayloadAction<Question>) => {
      insertOrReplace(state.questions, action.payload);
    },
    setLiked: (state, action: PayloadAction<{ questionId: number; isLiked: boolean }>) => {
      const { questionId, isLiked } = action.payload;
      const index = state.questions.findIndex((question) => question.id === questionId);
      state.questions[index].isLiked = isLiked;
    },
    addComment: (
      state,
      action: PayloadAction<{
        comment: Comment;
      }>
    ) => {
      state.comments.push(action.payload.comment);
    },
    editComment: (state, action: PayloadAction<{ comment: Comment }>) => {
      const index = state.comments.findIndex((comment) => comment.id === action.payload.comment.id);
      if (index >= 0) state.comments[index] = action.payload.comment;
    },
    removeComment: (state, action: PayloadAction<{ commentId: number }>) => {
      const index = state.comments.findIndex((comment) => comment.id === action.payload.commentId);
      state.comments.splice(index, 1);
    },
    toggleEditing: (state) => {
      state.isEditing = !state.isEditing;
    }
  }
});

export default questionsReducer;
