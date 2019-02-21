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
     * ========================================================
     * HER NEDENFOR HÅNDTERES DET IKKE AF types.CHANGE_SETTINGS
     */

    /**
     * Er vi ved at hente spørgsmål?
     */
    isFetching: false,

    /**
     * Hvornår blev sidst hentet spørgsmål?
     */
    lastFetch: null
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
        let { value, questions, type } = action.newSettings;

        /**
         * Hvilken indstilling ændrer vi?
         */
        switch (type) {
            case 'specialer': {
                /**
                 * specialer = allerede valgte specialer
                 * alreadySelected = er det speciale, brugeren klikkede på, allerede valgt?
                 */
                let specialer = state.specialer,
                    alreadySelected = state.specialer.indexOf(value);

                /**
                 * Er specialet allerede valgt?
                 * - Ja: Fjern det!
                 * - Nej: Tilføj det!
                 */
                if (alreadySelected > -1) {
                    specialer.splice(alreadySelected, 1);
                } else {
                    specialer.push(value);
                }
                state.specialer = specialer;
                break;
            }
            case 'semester': {
                /**
                 * API'en ved egentlig ikke hvilke sæt, der findes. Det beregnes
                 * her ud fra hvilke spørgsmål, der hentes ned (alle fra et
                 * semester hentes hver gang).
                 *
                 * Vi starter med et tomt array
                 */
                let sets = [];

                /**
                 * Vi looper over alle spørgsmål.
                 * Ud fra spørgsmålenes metadata, beregner vi så hvilke sæt,
                 * der findes.
                 */
                questions.forEach(q => {
                    // Er det forår eller efterår?
                    let season = q.examSeason.charAt(0) === 'F' ? 'Forår' : 'Efterår';

                    // Er det fra reeksamen (sjældent!)
                    let reex = '';
                    if (q.examSeason.toLowerCase().includes('ree')) {
                        reex = ' (reeks)';
                    }

                    /**
                     *  Hvad er det menneskelige navn for sættet
                     * (fx Forår 2018 (reeks))
                     */
                    let text = `${season} ${q.examYear}${reex}`;

                    /**
                     * Den mere API-venlige udgave:
                     * (fx 2018/E)
                     */
                    let api = `${q.examYear}/${q.examSeason}`;

                    /**
                     * Tilføj sættet til vores array
                     */
                    sets.push({
                        examSeason: q.examSeason.charAt(0),
                        examYear: q.examYear,
                        reex,
                        text,
                        api
                    });
                });

                /**
                 * Sorter vores eksamenssæt efter
                 * 1. examYear (asc)
                 * 2. examSeason (desc, fordi E kommer før F i alfabetet)
                 * 3. reex (asc, fordi reeks kommer efter ordinær)
                 */
                sets = _.orderBy(sets, ['examYear', 'examSeason', 'reex'], ['asc', 'desc', 'asc']);

                /**
                 * Vi har jo lavet en masse dubletter -- har loopet alle spørgsmål
                 * Nu fjerner vi dubletterne vha. lodash
                 */
                sets = _.uniqWith(sets, _.isEqual);

                state.sets = sets;
                state.questions = questions;
                state.semester = value;
                state.specialer = [];
                break;
            }
            default:
                // gælder for alle øvrige, se initialState øverst

                state[type] = value;
        }
    },
    /**
     * Bliver kaldt i starten af et API-request til serveren efter spørgsmål til
     * quizzen.
     *
     * Her tjekkes, om vi LIGE har hentet spørgsmål (og dette dispatch blev
     * overhalet indenom af selve FETCH_QUESTIONS).
     */
    [types.IS_FETCHING]: state => {
        state.isFetching = Date.now() - state.lastFetch > 1000 ? true : false;
    },

    /**
     * Bliver kaldt, når der er modtaget spørgsmål fra API'en.
     * Fortæller siden, at nu er spørgsmålene hentet.
     * Selve spørgsmålene behandles i questionsReducer.js
     */
    [types.FETCH_QUESTIONS]: state => {
        state.isFetching = false;
        state.lastFetch = Date.now();
    }
});
