import React from 'react';
import PropTypes from 'prop-types';
import { Comment } from 'semantic-ui-react';

import CommentsQuestionComment from './CommentsQuestionComment';

const CommentsQuestion = ({ question = {}, type = 'public' }) => {
  return (
    <div>
      <ol type="A">
        <li className={question.correctAnswers.indexOf(1) > -1 ? 'svar-korrekt' : ''}>
          {question.answer1}
        </li>
        <li className={question.correctAnswers.indexOf(2) > -1 ? 'svar-korrekt' : ''}>
          {question.answer2}
        </li>
        <li className={question.correctAnswers.indexOf(3) > -1 ? 'svar-korrekt' : ''}>
          {question.answer3}
        </li>
      </ol>

      <Comment.Group>
        <h5>Kommentarer</h5>
        {question[`${type}Comments`].map((commentId) => (
          <CommentsQuestionComment key={commentId} commentId={commentId} type={type} />
        ))}
      </Comment.Group>
    </div>
  );
};

CommentsQuestion.propTypes = {
  question: PropTypes.object,
  type: PropTypes.string
};

export default CommentsQuestion;
