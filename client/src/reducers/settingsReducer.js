import * as types from '../actions/types';
import _ from 'lodash';

import { createReducer } from 'redux-starter-kit';

const initialState = {
  /**
   * Spørgsmålstype
   * Tilfældige spørgsmål? Specialer? Sæt?
   */
  type: 'random',

  /**
   * Hvor mange spørgsmål vil du have?
   */
  n: 10,

  /**
   * Kun spg. der ikke tidligere er besvaret?
   */
  onlyNew: false,

  /**
   * Hvilket semester er valgt?
   */
  semester: 7,

  /**
   * Er der valgt et bestemt eksamenssæt?
   */
  set: null,

  /**
   * Hvilke specialer er valgt?
   */
  specialer: [],

  /**
   * Hvilke tags er valgt?
   */
  tags: [],

  /**
   * Hvilke spørgsmål er der for semesteret?
   * Benyttes til bl.a. at beregne hvor mange spg. i hvert speciale.
   */
  questions: [],

  /**
   * Hvilke sæt findes for specialet?
   */
  sets: [],
  /**
   * Hvilket sprog er valgt? kan være 'dk' eller 'gb'
   */
  language: 'dk',

  /**
   * Hvornår blev der sidst hentet spørgsmål til SETTINGS?
   */
  lastSettingsQuestionFetch: 0,

  /**
   * App version
   */
  version: '0.0.1',
  /**
   * ========================================================
   * HER NEDENFOR HÅNDTERES DET IKKE AF types.CHANGE_SETTINGS
   */

  /**
   * Er vi ved at hente spørgsmål?
   */
  isFetching: false,

  /**
   * Hvornår blev sidst hentet spørgsmål til QUIZZEN?
   */
  lastFetch: 0,

  metadata: { specialties: [], tags: [] }

};
/**
 * createReducer er en funktion fra redux-starter-kit, der laver en IMMUTABLE
 * version af state. Se dokumentation på: https://goo.gl/wJZmMX
 */
export default createReducer(initialState, {
  /**
   * Bliver kaldt hver gang der ændres indstillinger via forsiden
   */
  [types.CHANGE_SETTINGS]: (state, action) => {
    let { type, value } = action.newSettings;
    /**
     * Hvilken indstilling ændrer vi?
     */
    switch (type) {
      case 'specialer':
      case 'tags': {
        /**
         * specialer = allerede valgte specialer
         * alreadySelected = er det speciale, brugeren klikkede på, allerede valgt?
         */
        let currentSelection = state[type];

        let alreadySelected = state[type].indexOf(value);

        /**
         * Er specialet allerede valgt?
         * - Ja: Fjern det!
         * - Nej: Tilføj det!
         */
        if (alreadySelected > -1) {
          currentSelection.splice(alreadySelected, 1);
        } else {
          currentSelection.push(value);
        }
        state[type] = currentSelection;
        break;
      }
      case 'semester': {
        // Skal være sin egen for at cleare specialer/tags
        state.specialer = [];
        state.tags = [];
        state.semester = value;
        break;
      }
      default:
        // gælder for alle øvrige, se initialState øverst
        state[type] = value;
    }
  },
  /**
   * types.FETCH_SETTINGS_QUESTION
   */
  [types.SETTINGS_COUNT_TOTAL_QUESTIONS]: (state, action) => {
    state.totalQuestions = action.payload;

    state.lastSettingsQuestionFetch = Date.now();
  },
  /**
   * Bliver kaldt i starten af et API-request til serveren efter spørgsmål til
   * quizzen.
   *
   * Her tjekkes, om vi LIGE har hentet spørgsmål (og dette dispatch blev
   * overhalet indenom af selve FETCH_QUESTIONS).
   */
  [types.IS_FETCHING]: (state) => {
    state.isFetching = Date.now() - state.lastFetch > 1000;
  },

  /**
   * Bliver kaldt, når der er modtaget spørgsmål fra API'en.
   * Fortæller siden, at nu er spørgsmålene hentet.
   * Selve spørgsmålene behandles i questionsReducer.js
   */
  [types.FETCH_QUESTIONS]: (state) => {
    state.isFetching = false;
    state.lastFetch = Date.now();
  },
  [types.FETCH_METADATA]: (state, action) => {
    state.metadata = action.payload;
  },
  [types.SETTINGS_GET_SETS]: (state, action) => {
    state.sets = action.payload;
  }
});
