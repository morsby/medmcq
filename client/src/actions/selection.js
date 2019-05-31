import axios from 'axios';
import _ from 'lodash';
import * as types from './types';

export const changeSelection = (type, value) => (dispatch) => {
  dispatch({ type: types.CHANGE_SELECTION, payload: { type, value } });
};

export const invalidateSemesters = () => (dispatch) => {
  dispatch({ type: types.INVALIDATE_SEMESTERS });
  dispatch(fetchSemesters());
};

const shouldFetchSemesters = (state) => {
  const semesters = state.selection.semesters;
  if (_.isEmpty(semesters.items)) {
    return true;
  } else if (semesters.info.isFetching === true) {
    return false;
  } else {
    return semesters.info.didInvalidate;
  }
};

export const fetchSemesters = () => async (dispatch, getState) => {
  if (shouldFetchSemesters(getState())) {
    dispatch({ type: types.FETCH_SEMESTERS_REQUEST });

    try {
      let { data } = await axios.get('/api/semesters/');
      dispatch({
        type: types.FETCH_SEMESTERS_SUCCESS,
        semesters: data,
        receivedAt: Date.now()
      });
    } catch (err) {
      let error = err.response;
      dispatch({
        type: types.FETCH_SEMESTERS_FAILURE,
        error,
        receivedAt: Date.now()
      });
    }
  } else {
    return Promise.resolve();
  }
};
