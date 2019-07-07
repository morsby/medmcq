import axios from 'axios';
import * as types from './types';
import { getQuestions } from './question';

export const checkUserAvailability = (field, value) => async () => {
  let res = await axios.post('/api/users/check-availability', {
    field,
    value
  });
  return res.data;
};

export const signup = (post) => async (dispatch) => {
  console.log(post);
  let res = await axios.post('/api/users', post);

  dispatch({ type: types.AUTH_SIGNUP, payload: res.data });
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

export const getProfile = (semesterId = null) => async (dispatch, getState) => {
  dispatch({ type: types.AUTH_PROFILE_REQUEST });
  const userId = getState().auth.user.id;
  let res;
  semesterId = semesterId || getState().ui.selection.selectedSemester;
  try {
    res = await axios.get(`/api/users/${userId}/profile?semesterId=${semesterId}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err.response);
  }

  await dispatch(getQuestions({ ids: res.data.questions }));
  const questions = getState().questions.entities.questions;
  dispatch({ type: types.AUTH_PROFILE_SUCCESS, payload: { ...res.data, questions } });
};

export const editProfile = (values, callback) => async () => {
  let res = await axios.patch('/api/users', values);

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
  let res = await axios.post('/api/users/forgot', { email: email });
  return callback(res.data);
};

export const resetPassword = (token, values, callback) => async () => {
  let res = await axios.post(`/api/users/reset/${token}`, values);
  return callback(res.data);
};

export const manualCompleteSet = (api, user, semester) => async (dispatch) => {
  const res = await axios.put('/api/users/completedsets/' + user._id, { api, semester });

  dispatch({ type: types.AUTH_CURRENT_USER, payload: res.data });
};
