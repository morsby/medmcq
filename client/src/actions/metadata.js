import axios from 'axios';
import * as types from './types';

export const getMetadata = () => async (dispatch) => {
  dispatch({
    type: types.FETCH_METADATA_REQUEST
  });

  try {
    const { data: metadata } = await axios.get('/api/semesters');
    dispatch({ type: types.FETCH_METADATA_SUCCESS, payload: metadata, timestamp: Date.now() });
  } catch (err) {
    dispatch({ type: types.FETCH_METADATA_FAILURE, error: err });
  }
};
