import axios from 'axios';
import * as types from './types';
import { getQuestions } from './question';
import { makeToast } from './ui';
import User, { UserSignupInput, UserLoginInput } from 'classes/User';

export const checkUserAvailability = (field, value) => async () => {
  let res = await axios.post('/api/users/check-availability', {
    field,
    value
  });
  return res.data;
};

export const signup = async (signupData: UserSignupInput) => async (dispatch) => {
  const user = await User.signup(signupData);

  dispatch({ type: types.AUTH_SIGNUP, payload: user });
};

export const login = (loginData: UserLoginInput) => async (dispatch) => {
  loginData.username = loginData.username.toLowerCase();

  try {
    const user = await User.login(loginData);
    if (!user) return dispatch(makeToast('toast.auth.loginError', 'error'));
    dispatch(makeToast('toast.auth.loginSuccess', 'success'));
    dispatch(fetchUser(user.id));
  } catch ({ response }) {
    dispatch(makeToast('toast.auth.loginError', 'error'));
  }
};

export const logout = () => async (dispatch) => {
  // TODO: Remove JWT
};

export const fetchUser = (userId: number) => async (dispatch) => {
  dispatch({ type: types.AUTH_FETCH_USER_REQUEST });
  try {
    const user = await User.checkUser();
    if (!user) return dispatch(makeToast('toast.auth.fetchUserError', 'error'));
    dispatch({ type: types.AUTH_FETCH_USER_SUCCESS, payload: user });
  } catch ({ response }) {
    dispatch(makeToast('toast.auth.fetchUserError', 'error'));
  }
};

export const getProfile = (semesterId = null) => async (dispatch, getState) => {
  dispatch({ type: types.AUTH_PROFILE_REQUEST });
  const userId = getState().auth.user.id;
  let res;
  semesterId = semesterId || getState().ui.selection.selectedSemester;
  try {
    [res] = await Promise.all([
      axios.get(`/api/users/${userId}/profile?semesterId=${semesterId}`),
      dispatch(getQuestions({ quiz: false }))
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
    dispatch(fetchUser(user.id));
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
