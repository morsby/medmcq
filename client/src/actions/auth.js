import axios from 'axios';
import * as types from './types';

export const checkUserAvailability = (field, value) => async () => {
  let res = await axios.post('/api/user/check-availability', {
    field,
    value
  });
  return res.data;
};

export const signup = (post) => async () => {
  let res = await axios.post('/api/user', post);

  // dispatch({ type: types.AUTH_SIGNUP, payload: res.data });
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
      // eslint-disable-next-line
      alert(error);
    });

  return response;
};

export const fetchUser = () => async (dispatch) => {
  let res;
  try {
    res = await axios.get('/api/auth');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err.response);
  }

  dispatch({ type: types.AUTH_CURRENT_USER, payload: res.data });
};

export const getProfile = (userId) => async (dispatch) => {
  let res;
  try {
    res = await axios.get(`/api/users/${userId}/profile`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err.response);
  }

  dispatch({ type: types.AUTH_PROFILE, payload: res.data });
};

export const editProfile = (values, callback) => async () => {
  let res = await axios.patch('/api/user', values);

  return callback(res.data);
};

export const getAnsweredQuestions = (answers) => async (dispatch) => {
  // Receives an object of objects. Keys of the parent object are question IDs
  let ids = Object.keys(answers);

  let questions = [];

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

export const forgotPassword = (email, callback) => async () => {
  let res = await axios.post('/api/user/forgot', { email: email });
  return callback(res.data);
};

export const resetPassword = (token, values, callback) => async () => {
  let res = await axios.post(`/api/user/reset/${token}`, values);
  return callback(res.data);
};

export const manualCompleteSet = (api, user, semester) => async (dispatch) => {
  const res = await axios.put('/api/user/completedsets/' + user._id, { api, semester });

  dispatch({ type: types.AUTH_CURRENT_USER, payload: res.data });
};
