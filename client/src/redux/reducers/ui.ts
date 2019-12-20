import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  selection: {
    type: 'random',
    n: 10,
    onlyNew: false,
    onlyWrong: false,
    selectedSemester: 1,
    selectedSetId: null,
    selectedSpecialtyIds: [],
    selectedTagIds: []
  },
  error: false
};

const UIReducer = createSlice({
  name: 'UI',
  initialState,
  reducers: {
    changeSelection: (state, action) => {
      const { type, value } = action.payload;
      const { selection } = state;

      // Vi nulstiller hvis nyt semester
      if (type === 'selectedSemester') {
        selection.selectedSetId = null;
        selection.selectedSpecialtyIds = [];
        selection.selectedTagIds = [];
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
