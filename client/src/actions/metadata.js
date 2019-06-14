import axios from 'axios';
import * as types from './types';

export const getMetadata = () => async (dispatch) => {
  dispatch({
    type: types.FETCH_METADATA_REQUEST
  });

  try {
    const metadata = await axios.get('/api/semesters');
    dispatch({ type: types.FETCH_METADATA_SUCCESS, payload: metadata });
  } catch (err) {
    dispatch({ type: types.FETCH_METADATA_FAILURE, error: err });
  }
};
