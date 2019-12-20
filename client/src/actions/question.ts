/* eslint-disable camelcase */
import axios from 'axios';
import * as types from './types';
import { Dispatch } from 'redux';
import { makeToast } from './ui';
import Question from 'classes/Question';

export const getQuestions = ({
  ids = null,
  quiz = true,
  profile = !quiz,
  refetch = false,
  commentIds = null
}) => async (dispatch, getState) => {
  dispatch({ type: types.FETCH_QUESTIONS_REQUEST });
  let state = getState();
  let {
    type,
    selectedSemester,
    selectedSpecialtyIds,
    selectedTagIds,
    selectedSetId,
    n,
    onlyNew,
    onlyWrong
  } = state.ui.selection;

  let questions;
  // Hvilke spøgsmål bedes der om?
  if (ids) {
    type = 'ids';
    if (ids.length < 1) {
      return dispatch({
        type: types.FETCH_QUESTIONS_FAILURE,
        payload: { type: 'NotFound', message: 'No questions found' }
      });
    }
  }

  if (commentIds) {
    type = 'commentIds';
  }

  if (profile) {
    type = 'profile';
  }

  switch (type) {
    case 'ids':
      ids = ids.map((id) => Number(id));
      questions = await Question.fetch({ ids });
      break;
    case 'commentIds':
      questions = await Question.fetch({ commentIds });
      break;
    case 'specific':
      ids = ids.map((id) => Number(id));
      questions = await Question.fetch({ ids });
      break;
    case 'set':
      questions = await Question.fetch({ set: selectedSetId });
      break;
    case 'random':
      selectedTagIds = null;
      selectedSpecialtyIds = null;
    // eslint-disable-next-line
    default:
      questions = await Question.fetch({
        semester: selectedSemester,
        specialties: selectedSpecialtyIds,
        tags: selectedTagIds,
        n: n,
        onlyNew,
        onlyWrong
      });
  }

  if (questions.length > 0) {
    dispatch({
      type: types.FETCH_QUESTIONS_SUCCESS,
      payload: questions,
      quiz,
      refetch
    });
  } else {
    await dispatch({
      type: types.FETCH_QUESTIONS_FAILURE,
      payload: { type: 'NotFound', message: 'No questions found' }
    });
  }
};

export const writeComment = (questionId, text, isPrivate, isAnonymous) => async (dispatch) => {
  const res = await axios.post(`/api/questions/${questionId}/comment`, {
    text,
    isPrivate,
    isAnonymous
  });
  dispatch({
    type: types.QUESTION_UPDATE,
    payload: res.data
  });
};

export const deleteComment = (questionId, comment_id) => async (dispatch) => {
  const res = await axios.delete(`/api/questions/${questionId}/comment/${comment_id}`);

  dispatch({
    type: types.QUESTION_UPDATE,
    payload: res.data
  });
};

export const editComment = (questionId, commentId, comment, isPrivate, isAnonymous) => async (
  dispatch
) => {
  const res = await axios.patch(`/api/questions/${questionId}/comment/${commentId}`, {
    text: comment,
    isPrivate,
    isAnonymous
  });

  dispatch({
    type: types.QUESTION_UPDATE,
    payload: res.data
  });
};

export const likeComment = (commentId: number, userId: number) => async (dispatch) => {
  const res = await axios.post(`/api/questions/comments/${commentId}/like`);

  if (res.status === 204) return dispatch(types.COMMENT_UNLIKE({ userId, commentId })); // Comment has been unliked
  if (res.status === 200) return dispatch(types.COMMENT_LIKE({ userId, commentId })); // Comment has been liked

  dispatch(makeToast('toast.commentLike.error', 'error')); // Something went wrong
};

export const questionReport = ({ type, data }) => (dispatch) => {
  axios.post('/api/questions/report', { type, data });
  dispatch({ type: types.QUESTION_REPORT });
};

export const voteAction = (type, questionId, metadataId, vote) => async (dispatch) => {
  if (vote !== 'delete') {
    vote = Number(vote);
  }

  const res = await axios.put(`/api/questions/${questionId}/vote`, {
    type: type,
    id: Number(metadataId),
    value: vote
  });
  dispatch({
    type: types.QUESTION_UPDATE,
    payload: res.data
  });
};

export const searchQuestion = (semester, searchString) => async (dispatch) => {
  dispatch({ type: types.FETCH_QUESTIONS_REQUEST });
  const res = await axios.post('/api/questions/search', { semester, searchString });

  dispatch({
    type: types.FETCH_QUESTIONS_SUCCESS,
    payload: res.data,
    quiz: true
  });
};

export const createBookmark = (questionId: number) => async (dispatch: Dispatch) => {
  try {
    await axios.post(`/api/questions/${questionId}/bookmark`);
    dispatch(types.CREATE_BOOKMARK(questionId));
  } catch (error) {
    console.log(error);
  }
};

export const removeBookmark = (questionId: number) => async (dispatch: Dispatch) => {
  try {
    await axios.delete(`/api/questions/${questionId}/bookmark`);
    dispatch(types.REMOVE_BOOKMARK(questionId));
  } catch (error) {
    console.log(error);
  }
};
