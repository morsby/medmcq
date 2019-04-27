import React from 'react';
import PropTypes from 'prop-types';
import { Comment } from 'semantic-ui-react';

import CommentsQuestionComment from './CommentsQuestionComment';

const CommentsQuestion = ({ question, comments = [] }) => {
  return (
    <div>
      <ol type="A">
        <li className={question.correctAnswers.indexOf(1) > -1 ? 'svar-korrekt' : ''}>
          {question.answer1}
        </li>
        <li>{question.answer2}</li>
        <li>{question.answer3}</li>
      </ol>

      <Comment.Group>
        <h5>Kommentarer</h5>
        {comments.map((comment) => (
          <CommentsQuestionComment key={comment.id} comment={comment} />
        ))}
      </Comment.Group>
    </div>
  );
};

CommentsQuestion.propTypes = {
  question: PropTypes.object,
  comments: PropTypes.array
};

export default CommentsQuestion;
