import * as types from '../actions/types';
import _ from 'lodash';

import { createReducer } from 'redux-starter-kit';

const initialState = [{}];

export default createReducer(initialState, {
    [types.FETCH_QUESTIONS]: (state, action) => {
        let qs = action.payload;
        // Shuffle questions if not in set
        if (
            action.questionType === 'specialer' ||
            action.questionType === 'random'
        ) {
            qs = _.shuffle(qs);
        }
        return qs || false;
    },
    [types.ANSWER_QUESTION]: (state, action) => {
        const index = _.findIndex(state, { _id: action.payload.id });
        const q = state[index];
        q.answer = action.payload.answer;
    },
    [types.QUESTION_COMMENT]: (state, action) => {
        const { _id, comments } = action.payload.question;
        const index = _.findIndex(state, { _id });

        state[index].comments = comments;
    },
    [types.QUESTION_COMMENT_DELETE]: (state, action) => {
        const questionIndex = _.findIndex(state, {
                _id: action.payload.questionId,
            }),
            commentIndex = _.findIndex(state, {
                _id: action.payload.commentId,
            });

        state[questionIndex].comments.splice(commentIndex, 1);
    },
    [types.QUESTION_COMMENT_EDIT]: (state, action) => {
        const questionIndex = _.findIndex(state, {
                _id: action.payload.questionId,
            }),
            question = state[questionIndex],
            commentIndex = _.findIndex(question.comments, {
                _id: action.payload.commentId,
            }),
            comment = question.comments[commentIndex];

        comment.comment = action.payload.comment;
    },
});
