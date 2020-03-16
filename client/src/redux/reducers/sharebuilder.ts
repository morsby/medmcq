import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { insertOrReplace } from 'utils/common';
import Question from 'classes/Question';

const initialState = {
  picked: [] as Question[]
};

const shareBuilderReducer = createSlice({
  name: 'shareBuilder',
  initialState,
  reducers: {
    addPicked: (state, action: PayloadAction<Question>) => {
      const index = state.picked.findIndex((q) => q.id === action.payload.id);
      if (index !== -1) {
        state.picked.splice(index, 1);
      } else {
        insertOrReplace(state.picked, action.payload);
      }
    }
  }
});

export default shareBuilderReducer;
