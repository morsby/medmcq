/* eslint-disable camelcase */
import axios from 'axios';
import * as types from './types';

const questionApi = '/api/questions';

export const getQuestions = ({ ids = [], quiz = false }) => async (dispatch, getState) => {
  let state = getState();
  let {
    type,
    selectedSemester,
    selectedSpecialtyIds,
    selectedTagIds,
    selectedSetId,
    n,
    onlyNew
  } = state.ui.selection;

  dispatch({ type: types.FETCH_QUESTIONS_REQUEST });
  let res;
  // Hvilke spøgsmål bedes der om?
  switch (type) {
    /*
      types:
        - ids
        - set
        - random
        - specialer/tags
       */

    case 'ids':
    case 'specific':
      res = await axios.get(questionApi, { params: { ids: ids.join(',') } });
      break;
    case 'set':
      res = await axios.get(`/api/exam_sets/${selectedSetId}/questions`);
      break;
    default:
      res = await axios.get(questionApi, {
        params: {
          semesters: selectedSemester,
          specialties: (selectedSpecialtyIds || []).join(',') || undefined,
          tags: (selectedTagIds || []).join(',') || undefined,
          n: n || undefined,
          onlyNew: onlyNew || undefined
        }
      });
  }

  if (res.data.length > 0) {
    dispatch({
      type: types.FETCH_QUESTIONS_SUCCESS,
      payload: res.data,
      quiz
    });
  } else {
    dispatch({
      type: types.FETCH_QUESTIONS_FAILURE,
      payload: { type: 'NotFound', message: 'No questions found' }
    });
  }
};

export const writeComment = (questionId, comment, isPrivate, anonymous) => async (dispatch) => {
  const res = await axios.post(`/api/questions/${questionId}/comment`, {
    comment,
    isPrivate,
    anonymous
  });
  dispatch({
    type: types.QUESTION_COMMENT_UPDATE,
    payload: res.data
  });
};

export const deleteComment = (question_id, comment_id) => async (dispatch) => {
  const res = await axios.delete(`/api/questions/${question_id}/comment/${comment_id}`);

  dispatch({
    type: types.QUESTION_COMMENT_UPDATE,
    payload: res.data
  });
};

export const editComment = (question_id, comment_id, comment, isPrivate, anonymous) => async (
  dispatch
) => {
  const res = await axios.put(`/api/questions/${question_id}/comment/${comment_id}`, {
    comment,
    isPrivate,
    anonymous
  });

  dispatch({
    type: types.QUESTION_COMMENT_UPDATE,
    payload: res.data
  });
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

export const searchQuestion = (semester, search) => async (dispatch) => {
  const res = await axios.post('/api/questions/search', { search, semester });

  dispatch({
    type: types.FETCH_QUESTIONS_SUCCESS,
    payload: res.data,
    questionType: 'random'
  });
};
