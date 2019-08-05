import * as types from '../actions/types';
import { createReducer } from 'redux-starter-kit';

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
