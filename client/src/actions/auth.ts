import axios from 'axios';
import * as types from './types';
import { getQuestions } from './question';
import { makeToast } from './ui';

export const checkUserAvailability = (field, value) => async () => {
  let res = await axios.post('/api/users/check-availability', {
    field,
    value
  });
  return res.data;
};

export const signup = (post) => async (dispatch) => {
  let res = await axios.post('/api/users', post);

  dispatch({ type: types.AUTH_SIGNUP, payload: res.data });
  return res.data;
};

export const login = (post) => async (dispatch) => {
  post.username = post.username.toLowerCase();

  try {
    let response = await axios.post('/api/auth', post);
    dispatch(makeToast('toast.auth.loginSuccess', 'success'));
    dispatch(fetchUser());
    return response.data;
  } catch ({ response }) {
    dispatch(makeToast('toast.auth.loginError', 'error'));
  }
};

export const logout = () => async (dispatch) => {
  try {
    let res = await axios.get('/api/auth/logout');
    if (res.data.type === 'LogoutSuccess') {
      dispatch(makeToast('toast.auth.logoutSuccess', 'success'));
    } else {
      dispatch(makeToast('toast.auth.logoutError', 'error'));
    }
  } catch ({ response }) {
    dispatch(makeToast('toast.auth.logoutError', 'error'));
  }

  dispatch(fetchUser());
};

export const fetchUser = () => async (dispatch) => {
  let res;
  try {
    res = await axios.get('/api/auth');
  } catch ({ response }) {
    dispatch(makeToast('toast.auth.fetchUserError', 'error'));
  }

  dispatch({ type: types.AUTH_CURRENT_USER, payload: res.data });
};

export const getProfile = (semesterId = null) => async (dispatch, getState) => {
  dispatch({ type: types.AUTH_PROFILE_REQUEST });
  const userId = getState().auth.user.id;
  let res;
  semesterId = semesterId || getState().ui.selection.selectedSemester;
  try {
    [res] = await Promise.all([
      axios.get(`/api/users/${userId}/profile?semesterId=${semesterId}`),
      dispatch(getQuestions({ profile: true }))
    ]);
  } catch ({ response }) {
    dispatch(makeToast('toast.auth.fetchProfileError', 'error'));
  }

  const questions = getState().questions.entities.questions;
  dispatch({ type: types.AUTH_PROFILE_SUCCESS, payload: { ...res.data, questions } });
};

export const editProfile = (values) => async (dispatch, getState) => {
  let { auth } = getState();
  try {
    await axios.patch(`/api/users/${auth.user.id}`, values);

    // TODO: FIX MSG

    dispatch(makeToast('toast.editProfile.success', 'success'));
    dispatch(fetchUser());
  } catch ({ response }) {
    dispatch(makeToast('toast.editProfile.error', 'error'));
  }
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

export const forgotPassword = (email, callback) => async (dispatch) => {
  let res;
  try {
    res = await axios.post('/api/users/forgot-password', { email: email });
  } catch ({ response }) {
    res = response;
    dispatch(makeToast('toast.genericError', 'success'));
  }
  return callback(res.data);
};

export const resetPassword = (resetPasswordToken, values, callback) => async (dispatch) => {
  let res;
  try {
    await axios.post('/api/users/reset-password', { resetPasswordToken, ...values });
  } catch ({ response }) {
    res = response;
    dispatch(makeToast('toast.genericError', 'success'));
  }
  return callback(res.data);
};

export const manualCompleteSet = (setId, userId) => async (dispatch) => {
  await axios.put('/api/users/completedsets/' + userId, { setId });

  await dispatch(fetchUser());
};
