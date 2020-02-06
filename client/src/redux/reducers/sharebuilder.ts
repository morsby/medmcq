import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  picked: [] as number[]
};

const shareBuilderReducer = createSlice({
  name: 'shareBuilder',
  initialState,
  reducers: {
    setPicked: (state, action: PayloadAction<number[]>) => {
      state.picked = action.payload;
    }
  }
});

export default shareBuilderReducer;
