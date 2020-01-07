import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnswerInput } from 'classes/Quiz';
import moment from 'moment-timezone';

const initialState = {
  questionIds: [] as number[],
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
    setQuestionIds: (state, action: PayloadAction<number[]>) => {
      state.questionIds = action.payload;
      state.answers = [];
      state.usedExamTime = ''; // Sættes hver gang der startes ny quiz, for at undgå overlap fra tidligere examMode
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
