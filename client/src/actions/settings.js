import axios from 'axios';
import * as types from './types';
import _ from 'lodash';

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
  if (!questions) return;
  dispatch({
    type: types.FETCH_SETTINGS_QUESTION,
    questions,
    semester
  });
};

export const fetchMetadata = (semester) => async (dispatch) => {
  const { data: metadata } = await axios.get('/api/questions/metadata/count?sem=' + semester);
  let { specialtyCount: specialties, tagCount: tags } = metadata;
  if (!specialties || !tags) return;
  specialties = _.sortBy(specialties, (s) => s.text);
  tags = _.sortBy(tags, (t) => t.text);

  dispatch({
    type: types.FETCH_METADATA,
    payload: { specialties, tags, date: Date.now() }
  });
};
