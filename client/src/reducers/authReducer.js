import * as types from '../actions/types';

import _ from 'lodash';

import { createReducer } from 'redux-starter-kit';

/**
 * user defaulter til null; burde måske være et tomt object (men så vil mange
 * Component-auth checks skulle skrives om, da user vil være === true)
 * Performance udregnes lidt kringlet nedenfor.
 */
const initialState = {
    user: null,
    performance: {
        answeredQuestions: {},
        summary: { allRight: [], allWrong: [], mixed: [] }
    }
};

/**
 * createReducer er en funktion fra redux-starter-kit, der laver en IMMUTABLE
 * version af state. Se dokumentation på: https://goo.gl/wJZmMX
 */
export default createReducer(initialState, {
    [types.AUTH_CURRENT_USER]: (state, action) => {
        // Modtages en bruger? Ellers sender vi et tomt object
        let user = action.payload ? action.payload : null;
        state.user = user;
    },
    [types.AUTH_GET_ANSWERED_QUESTIONS]: (state, action) => {
        // GETs full questions (from API) and the user's answers:
        let { questions, answers } = action;

        /**
         * Laver et object af spørgsmål, hvor key er question._id.
         * Hvert spørgsmål tillægges derudover en ny key, `userAnswers`,
         * der indeholder brugeres svar i formen
         *   userAnswers: {
         *      correct: n,
         *      wrong: m
         *   }
         */
        let answeredQuestions = {};
        questions.map(e => {
            answeredQuestions[e._id] = e;
            _.set(answeredQuestions, [e._id], {
                ...answeredQuestions[e._id],
                userAnswers: answers[e._id]
            });
            return null;
        });

        // Loops over all answers, generating a summary
        let summary = { allRight: [], allWrong: [], mixed: [] };

        // Få de question._ids, som brugeren har svaret på
        let ids = Object.keys(answers);

        ids.map(id => {
            let answer = answers[id];

            if (answer.correct > 0 && answer.wrong === 0) {
                summary.allRight.push(id);
            } else if (answer.correct === 0 && answer.wrong > 0) {
                summary.allWrong.push(id);
            } else if (answer.correct > 0 && answer.wrong > 0) {
                summary.mixed.push(id);
            }
            return null;
        });

        state.performance.summary = summary;
        state.performance.answeredQuestions = answeredQuestions;
    }
});
