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
