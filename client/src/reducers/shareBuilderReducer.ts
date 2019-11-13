import * as types from '../actions/types';
import { createReducer } from '@reduxjs/toolkit';

export interface IShareBuilderState {
  picked: [number?];
}

const initialState: IShareBuilderState = {
  picked: []
};

export default createReducer(initialState, {
  [types.CHANGE_PICKED.type]: (state, action) => {
    state.picked = action.payload;
  }
});
