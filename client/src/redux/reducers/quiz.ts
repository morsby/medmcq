import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  questionIds: [] as number[],
  answers: [] as { questionId: number; answer: number }[],
  questionIndex: 0,
  didInvalidate: false,
  imgOpen: false
};

const quizReducer = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setQuestionIds: (state, action: PayloadAction<number[]>) => {
      state.questionIds = action.payload;
      state.answers = [];
    },
    changeQuestion: (state, action: PayloadAction<number>) => {
      state.questionIndex = action.payload;
    },
    setImgOpen: (state, action: PayloadAction<boolean>) => {
      state.imgOpen = action.payload;
    },
    answer: (state, action: PayloadAction<{ questionId: number; answer: number }>) => {
      state.answers.push(action.payload);
    }
  }
});

export default quizReducer;
