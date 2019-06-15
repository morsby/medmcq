import * as types from '../actions/types';
import { updateSelection } from '../utils/reducers';

export const initialState = {
  loading: false,
  selection: {
    type: 'random',
    n: 10,
    onlyNew: false,
    selectedSemester: 1,
    selectedSetId: null,
    selectedSpecialtyIds: [],
    selectedTagIds: []
  },
  error: false
};

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    // Change settings
    case types.CHANGE_SELECTION:
      return { ...state, selection: updateSelection(state.selection, action) };

    // Successes
    case types.FETCH_METADATA_SUCCESS:
      return { ...state, loading: false };
    // Failures
    case types.FETCH_METADATA_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default uiReducer;
