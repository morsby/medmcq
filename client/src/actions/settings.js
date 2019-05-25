import axios from 'axios';
import * as types from './types';

export const changeSettings = (settings) => (dispatch) => {
  /**
   * Hvis vi ændrer semesteret ELLER der er gået mere end 5 min siden sidste
   * load af spørgsmål, henter vi nye spørgsmål.
   */
  if (
    settings.type === 'semester' ||
    (Date.now() - settings.lastSettingsQuestionFetch) / 1000 > 300
  ) {
    dispatch(fetchSettingsQuestions(settings.value));
  }
  dispatch({
    type: types.CHANGE_SETTINGS,
    newSettings: settings
  });
};

export const fetchSettingsQuestions = (semester) => async (dispatch) => {
  const res = await axios.get('/api/questions/count/' + semester);
  let questions = res.data;
  dispatch({
    type: types.FETCH_SETTINGS_QUESTION,
    questions,
    semester
  });
};

export const fetchMetadata = (semester) => async (dispatch) => {
  const { data: metadata } = await axios.get('/api/questions/metadata/count?sem=' + semester);
  const { specialtyCount: specialties, tagCount: tags } = metadata;
  if (!specialties || !tags) return;
  dispatch({
    type: types.FETCH_METADATA,
    payload: { specialties, tags }
  });
};
