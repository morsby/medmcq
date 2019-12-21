import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  questionIds: [] as number[],
  answers: {},
  quizId: null,
  currentQuestionNumber: 0,
  didInvalidate: false,
  imgOpen: false
};

const quizReducer = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setQuestionIds: (state, action: PayloadAction<number[]>) => {
      state.questionIds = action.payload;
    },
    changeQuestion: (state, action: PayloadAction<number>) => {
      state.currentQuestionNumber = action.payload;
    },
    setImgOpen: (state, action: PayloadAction<boolean>) => {
      state.imgOpen = action.payload;
    }
  }
});

export default quizReducer;
