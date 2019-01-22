import * as types from '../actions/types';
import _ from 'lodash';

export default function(state = [], action) {
    let newState, q, questionIndex, commentIndex;
    switch (action.type) {
        case types.FETCH_QUESTIONS:
            let questions = action.payload;
            // Shuffle questions if not in set
            if (
                action.questionType === 'specialer' ||
                action.questionType === 'random'
            ) {
                questions = _.shuffle(questions);
            }
            return questions || false;
        case types.ANSWER_QUESTION:
            newState = [...state];

            q = _.findIndex(newState, { _id: action.payload.id });
            newState[q].answer = action.payload.answer;
            return newState;
        case types.QUESTION_COMMENT:
            let { _id, comments } = action.payload.question;

            newState = [...state];
            q = _.findIndex(newState, { _id });
            newState[q].comments = comments;
            return newState;
        case types.QUESTION_COMMENT_DELETE:
            newState = [...state];

            questionIndex = _.findIndex(newState, {
                _id: action.payload.questionId,
            });
            commentIndex = _.findIndex(newState[questionIndex].comments, {
                _id: action.payload.commentId,
            });

            newState[questionIndex].comments.splice(commentIndex, 1);
            return newState;
        case types.QUESTION_COMMENT_EDIT:
            newState = [...state];

            questionIndex = _.findIndex(newState, {
                _id: action.payload.questionId,
            });
            commentIndex = _.findIndex(newState[questionIndex].comments, {
                _id: action.payload.commentId,
            });

            newState[questionIndex].comments[commentIndex].comment =
                action.payload.comment;
            return newState;
        default:
            return state;
    }
}
