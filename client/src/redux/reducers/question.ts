import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Question from 'classes/Question';
import Comment from 'classes/Comment';
import Tag from 'classes/Tag';
import Specialty, { SpecialtyVote } from 'classes/Specialty';

const initialState = { questions: [] as Question[], isFetching: false };

const questionsReducer = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
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
    setComment: (
      state,
      action: PayloadAction<{
        questionId: number;
        publicComments: Comment[];
        privateComments: Comment[];
      }>
    ) => {
      const { questionId, publicComments, privateComments } = action.payload;
      const index = state.questions.findIndex((question) => question.id === questionId);
      state.questions[index].publicComments = publicComments;
      state.questions[index].privateComments = privateComments;
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
    }
  }
});

export default questionsReducer;
