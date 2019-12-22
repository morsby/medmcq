import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QuestionFilterInput } from 'classes/Question';

const initialState = {
  isLoading: false,
  selection: {
    type: 'random',
    n: 10,
    onlyNew: false,
    onlyWrong: false,
    semesterId: 1,
    setId: null,
    specialtyIds: [],
    tagIds: []
  },
  error: false
};

const UIReducer = createSlice({
  name: 'UI',
  initialState,
  reducers: {
    changeSelection: (
      state,
      action: PayloadAction<{ type: keyof QuestionFilterInput | 'type'; value: any }>
    ) => {
      const { type, value } = action.payload;
      const { selection } = state;

      // Vi nulstiller hvis nyt semester
      if (type === 'semesterId') {
        selection.setId = null;
        selection.specialtyIds = [];
        selection.tagIds = [];
      }

      selection[type] = value;

      // Skift checkboxene afhængigt af type, da disse ikke overlapper
      if (type === 'onlyNew') {
        selection.onlyWrong = false;
      }
      if (type === 'onlyWrong') {
        selection.onlyNew = false;
      }
    }
  }
});

export default UIReducer;
