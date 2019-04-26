import axios from 'axios';
import * as types from './types';

export const checkUserAvailability = (field, value) => async () => {
  let res = await axios.post(`/api/user/check-availability`, {
    field,
    value
  });
  return res.data;
};

export const signup = (post) => async (dispatch) => {
  let res = await axios.post('/api/user', post);

  //dispatch({ type: types.AUTH_SIGNUP, payload: res.data });
  return res.data;
};

export const login = (post) => async (dispatch) => {
  post.username = post.username.toLowerCase();
  let response;
  await axios
    .post('/api/auth', post)
    .then(function(res) {
      // handle success
      dispatch(fetchUser());
      response = res.data;
      return res.data;
    })
    .catch(function(error) {
      // handle error
      //console.log(error);
    });

  return response;
};

export const fetchUser = () => async (dispatch) => {
  let res = await axios.get('/api/user/me');

  dispatch({ type: types.AUTH_CURRENT_USER, payload: res.data });
};

export const editProfile = (values, callback) => async (dispatch) => {
  let res = await axios.put('/api/user/edit', values);

  return callback(res.data);
};

export const getAnsweredQuestions = (answers) => async (dispatch) => {
  // Receives an object of objects. Keys of the parent object are question IDs
  let ids = Object.keys(answers),
    questions = [];

  if (ids.length > 0) {
    const res = await axios.post('/api/questions/ids', {
      ids: ids,
      purpose: 'profile-stats'
    });

    questions = res.data;
  }
  dispatch({
    type: types.AUTH_GET_ANSWERED_QUESTIONS,
    answers,
    questions
  });
};

export const forgotPassword = (email, callback) => async (dispatch) => {
  let res = await axios.post('/api/user/forgot', { email: email });
  return callback(res.data);
};

export const resetPassword = (token, values, callback) => async (dispatch) => {
  let res = await axios.post(`/api/user/reset/${token}`, values);
  return callback(res.data);
};
