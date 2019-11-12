import * as types from '../actions/types';
import { updateSelection } from '../utils/reducers';

export const initialState = {
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

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    // Pure UI changes
    case types.UI_LOADING:
      return { ...state, isLoading: true };
    case types.UI_DONE_LOADING:
      return { ...state, isLoading: false };

    // Change settings
    case types.CHANGE_SELECTION:
      return { ...state, selection: updateSelection(state.selection, action) };

    // Requests
    case types.FETCH_METADATA_REQUEST:
    case types.FETCH_QUESTIONS_REQUEST:
      return { ...state, isLoading: true };

    // Successes
    case types.FETCH_METADATA_SUCCESS:
    case types.FETCH_QUESTIONS_SUCCESS:
      return { ...state, isLoading: false, error: false };
    // Failures
    case types.FETCH_METADATA_FAILURE:
    case types.FETCH_QUESTIONS_FAILURE:
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export default uiReducer;
