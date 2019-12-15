import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Question from 'classes/Question';

const initialState = {
  questions: [] as Question[],
  answers: {},
  quizId: null,
  currentQuestion: 0,
  didInvalidate: false
};

const quizReducer = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<{ questions: Question[] }>) => {
      state.questions = action.payload.questions;
    },
    answer: (state, action: PayloadAction<{ questionId: number; answer: number }>) => {
      const { questionId, answer } = action.payload;
      const index = state.questions.findIndex((question) => question.id === questionId);
      state.questions[index].answer = answer;
    }
  }
});

export default quizReducer;
