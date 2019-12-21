import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Question from 'classes/Question';
import Comment from 'classes/Comment';
import Tag, { TagVote } from 'classes/Tag';
import Specialty, { SpecialtyVote } from 'classes/Specialty';

const initialState = {
  questions: [] as Question[],
  comments: [] as Comment[],
  tagVotes: [] as TagVote[],
  specialtyVotes: [] as SpecialtyVote[],
  isFetching: false
};

const questionsReducer = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;

      let comments: Comment[] = [];
      action.payload.forEach((question) =>
        comments.concat([...question.publicComments, ...question.privateComments])
      );
      state.comments = comments;

      let tagVotes = [];
      action.payload.forEach((question) => {
        tagVotes.concat(question.tagVotes);
      });
      state.tagVotes = tagVotes;

      let specialtyVotes = [];
      action.payload.forEach((question) => {
        specialtyVotes.concat(question.specialtyVotes);
      });

      state.specialtyVotes = specialtyVotes;
    },
    setBookmarked: (
      state,
      action: PayloadAction<{ questionId: number; isBookmarked: boolean }>
    ) => {
      const { questionId, isBookmarked } = action.payload;
      const index = state.questions.findIndex((question) => question.id === questionId);
      state.questions[index].isBookmarked = isBookmarked;
    },
    answer: (state, action: PayloadAction<{ questionId: number; answer: number }>) => {
      const { questionId, answer } = action.payload;
      const index = state.questions.findIndex((question) => question.id === questionId);
      state.questions[index].answer = answer;
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
    setTags: (
      state,
      action: PayloadAction<{ questionId: number; tags: Tag[]; SpecialtyVotes: SpecialtyVote[] }>
    ) => {
      const { questionId, tags } = action.payload;
      const index = state.questions.findIndex((question) => question.id === questionId);
      state.questions[index].tags = tags;
    },
    setSpecialties: (
      state,
      action: PayloadAction<{
        questionId: number;
        specialties: Specialty[];
        specialtyVotes: SpecialtyVote[];
      }>
    ) => {
      const { questionId, specialties } = action.payload;
      const index = state.questions.findIndex((question) => question.id === questionId);
      state.questions[index].specialties = specialties;
    },
    voteTag: (state, action: PayloadAction<TagVote>) => {
      const index = state.tagVotes.findIndex(
        (vote) =>
          action.payload.question.id === vote.question.id && action.payload.tag.id === vote.tag.id
      );
      if (index < 0) {
        state.tagVotes.push(action.payload);
      } else {
        state.tagVotes[index] = action.payload;
      }
    },
    voteSpecialty: (state, action: PayloadAction<SpecialtyVote>) => {
      const index = state.specialtyVotes.findIndex(
        (vote) =>
          action.payload.question.id === vote.question.id &&
          action.payload.specialty.id === vote.specialty.id
      );
      if (index < 0) {
        state.specialtyVotes.push(action.payload);
      } else {
        state.specialtyVotes[index] = action.payload;
      }
    }
  }
});

export default questionsReducer;
