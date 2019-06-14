/* eslint-disable camelcase */
import axios from 'axios';
import * as types from './types';

const questionApi = '/api/questions';

export const getQuestions = (ids) => async (dispatch, getState) => {
  let state = getState();
  let {
    type,
    selectedSpecialtyIds,
    selectedTagIds,
    selectedSetId,
    n,
    onlyNew
  } = state.selection.quizSelection;
  let { selectedSemester } = state.selection.semesters;

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

  dispatch({ type: types.QUIZ_NAVIGATE, payload: 0 });
  dispatch({
    type: types.FETCH_QUESTIONS_SUCCESS,
    payload: res.data,
    createdAt: Date.now()
  });
};

export const answerQuestion = (id, answer, correct, semester, user = null) => (dispatch) => {
  let post = {
    questionId: id,
    answer: correct.correct ? 'correct' : 'wrong',
    answerNo: answer,
    semester
  };
  if (user) axios.post('/api/questions/answer', post);

  dispatch({ type: types.ANSWER_QUESTION, payload: { id, answer, correct } });
  dispatch({
    type: types.AUTH_UPDATE_USER_ANSWERS,
    payload: { semester, id, correct }
  });
};

export const postQuestion = (post) => async (dispatch) => {
  const formData = new window.FormData();

  formData.append('question', post.question);
  formData.append('answer1', post.answer1);
  formData.append('answer2', post.answer2);
  formData.append('answer3', post.answer3);
  formData.append('correctAnswer', post.correctAnswer);
  formData.append('semester', post.semester);
  formData.append('examYear', post.examYear);
  formData.append('examSeason', post.examSeason);
  formData.append('specialty', post.specialty);
  if (post.image) {
    formData.append('image', post.image, post.image.name);
  }

  const res = await axios.post('/api/questions', formData);
  dispatch({ type: types.POST_QUESTION, payload: res.data });
};

export const commentQuestion = (id, comment, isPrivate, anonymous) => async (dispatch) => {
  const res = await axios.put(`/api/questions/${id}/comment`, {
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

export const voteAction = (type, questionId, metadataId, vote, user) => async (dispatch) => {
  const res = await axios.put('/api/questions/metadata/vote', {
    type: type,
    questionId,
    metadataId,
    vote,
    user
  });
  dispatch({
    type: types.QUESTION_SPECIALTY_UPDATE,
    payload: res.data
  });
};

export const newMetadata = (type, value, id, user) => async (dispatch) => {
  const res = await axios.post('/api/questions/metadata/question/' + id, {
    type,
    value,
    user
  });

  dispatch({
    type: types.QUESTION_SPECIALTY_UPDATE,
    payload: res.data
  });
};

export const searchQuestion = (semester, search) => async (dispatch) => {
  const res = await axios.post('/api/questions/search', { search, semester });

  dispatch({ type: types.QUIZ_NAVIGATE, payload: 0 });
  dispatch({
    type: types.FETCH_QUESTIONS_SUCCESS,
    payload: res.data,
    questionType: 'random'
  });
};
