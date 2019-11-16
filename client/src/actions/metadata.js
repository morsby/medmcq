import * as types from './types';
import _ from 'lodash';
import Semester from 'classes/Semester';

export const invalidateMetadata = () => (dispatch) => {
  dispatch({ type: types.INVALIDATE_METADATA });
  dispatch(getMetadata());
};

const shouldFetchMetadata = (state) => {
  const metadata = state.metadata;
  if (_.isEmpty(metadata.entities)) {
    return true;
  } else if (metadata.isFetching === true) {
    return false;
  } else {
    return metadata.didInvalidate;
  }
};

export const getMetadata = () => async (dispatch, getState) => {
  if (shouldFetchMetadata(getState())) {
    dispatch({
      type: types.FETCH_METADATA_REQUEST
    });

    try {
      const semesters = await Semester.fetchAll();
      dispatch({
        type: types.FETCH_METADATA_SUCCESS,
        payload: semesters,
        timestamp: Date.now()
      });
    } catch (err) {
      dispatch({ type: types.FETCH_METADATA_FAILURE, error: err });
    }
  } else {
    return Promise.resolve();
  }
};
