import * as types from '../actions/types';
import { createReducer } from 'redux-starter-kit';
import _ from 'lodash';
import { insertOrRemove } from '../utils/common';

const initialState = {
  semesters: {
    selectedSemester: 1,
    info: {
      lastUpdated: 0,
      isFetching: false,
      didInvalidate: false,
      error: {}
    },
    items: {}
  },
  quizSelection: {
    type: 'random',
    n: 10,
    onlyNew: false,
    selectedSetId: null,
    selectedSpecialtyIds: [],
    selectedTagIds: []
  }
};

/**
 * createReducer er en funktion fra redux-starter-kit, der laver en IMMUTABLE
 * version af state. Se dokumentation på: https://goo.gl/wJZmMX
 */
export default createReducer(initialState, {
  /*
   * Reducer  der ændrer settinngs.
   */
  [types.CHANGE_SELECTION]: (state, action) => {
    let { type, value } = action.payload;

    // Vi nulstill
    if (type === 'selectedSemester') {
      state.quizSelection.selectedSetId = null;
      state.quizSelection.selectedSpecialtyIds = [];
      state.quizSelection.selectedTagIds = [];
      state.semesters.selectedSemester = value;
    } else {
      // Hvis vi ændrer specialer/tags, opdaterer vi array'et
      if (['selectedSpecialtyIds', 'selectedTagIds'].indexOf(type) > -1) {
        let selection = Array.isArray(state.quizSelection[type]) ? state.quizSelection[type] : [];
        value = insertOrRemove(selection, value);
      }
      state.quizSelection[type] = value;
    }
  },
  /*
   * Siger at semestrene trænger til en opdateret henting fra api'en.
   */
  [types.INVALIDATE_SEMESTERS]: (state) => {
    state.semesters.info.didInvalidate = true;
  },

  /*
   * Når et API-kald til at hente semestre starter
   */
  [types.FETCH_SEMESTERS_REQUEST]: (state) => {
    state.semesters.info.didInvalidate = false;
    state.semesters.info.isFetching = true;
  },

  /*
   * Hvis api'en fejler
   */
  [types.FETCH_SEMESTERS_FAILURE]: (state, action) => {
    state.semesters.info.error = action.error;
    state.semesters.info.isFetching = false;
  },

  /*
   * Til at opdatere semestrene i state
   */
  [types.FETCH_SEMESTERS_SUCCESS]: (state, action) => {
    let { semesters, receivedAt } = action;
    state.semesters.info.didInvalidate = false;
    state.semesters.info.isFetching = false;
    state.semesters.info.lastUpdated = receivedAt;
    state.semesters.info.error = {};
    state.semesters.items = _.keyBy(semesters, (semester) => semester.id);
  }
});
