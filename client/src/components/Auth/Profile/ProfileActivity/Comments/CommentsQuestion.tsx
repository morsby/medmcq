import React from 'react';
import { Comment } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';

import CommentsQuestionComment from './CommentsQuestionComment';
import Question from 'classes/Question';

export interface CommentsQuestionProps {
  question: Question;
  type: 'public' | 'private';
}

const CommentsQuestion: React.SFC<CommentsQuestionProps> = ({ question, type }) => {
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
        <Translate id="profileComments.comments_header" />
        {question[`${type}Comments`].map((commentId) => (
          <CommentsQuestionComment key={commentId} commentId={commentId} type={type} />
        ))}
      </Comment.Group>
    </div>
  );
};

export default CommentsQuestion;
