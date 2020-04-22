import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment-timezone';
import { AnswerInput } from 'types/generated';

const initialState = {
  answers: [] as AnswerInput[],
  questionIndex: 0,
  didInvalidate: false,
  imgOpen: false,
  hidePercentages: false,
  examMode: true,
  examModeStart: null as Date | null,
  usedExamTime: ''
};

const quizReducer = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    resetQuiz: (state) => {
      state.answers = [];
      state.questionIndex = 0;
      state.usedExamTime = '';
    },
    changeQuestion: (state, action: PayloadAction<number>) => {
      state.questionIndex = action.payload;
    },
    setImgOpen: (state, action: PayloadAction<boolean>) => {
      state.imgOpen = action.payload;
    },
    answer: (state, action: PayloadAction<AnswerInput>) => {
      const index = state.answers.findIndex(
        (answer) => answer.questionId === action.payload.questionId
      );
      if (index !== -1) {
        state.answers[index] = action.payload;
      } else {
        state.answers.push(action.payload);
      }
    },
    togglePercentages: (state) => {
      state.hidePercentages = !state.hidePercentages;
    },
    startExamMode: (state) => {
      state.examMode = true;
      state.hidePercentages = true;
      state.examModeStart = new Date();
    },
    stopExamMode: (state) => {
      state.usedExamTime = moment.duration(moment(new Date()).diff(state.examModeStart)).humanize();
      state.examMode = false;
      state.hidePercentages = false;
      state.examModeStart = null;
    }
  }
});

export default quizReducer;
