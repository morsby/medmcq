import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QuestionFilterInput } from 'types/generated';

const initialState = {
  type: 'random' as 'random' | 'metadata' | 'set',
  n: 10,
  onlyNew: false,
  onlyWrong: false,
  semesterId: 1,
  examSetId: null as number,
  specialtyIds: [] as number[],
  tagIds: [] as number[],
  search: '',
  text: ''
} as Partial<QuestionFilterInput> & { type: 'random' | 'metadata' | 'set' };

export type SelectionOptions = keyof typeof initialState;

const selectionReducer = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    changeSelection: (state, action: PayloadAction<{ type: SelectionOptions; value: any }>) => {
      const { type, value } = action.payload;

      // Vi nulstiller hvis nyt semester
      if (type === 'semesterId') {
        state.examSetId = null;
        state.specialtyIds = [];
        state.tagIds = [];
      }

      (state[type] as any) = value;

      // Skift checkboxene afhængigt af type, da disse ikke overlapper
      if (type === 'onlyNew') {
        state.onlyWrong = false;
      }
      if (type === 'onlyWrong') {
        state.onlyNew = false;
      }
    }
  }
});

export default selectionReducer;
