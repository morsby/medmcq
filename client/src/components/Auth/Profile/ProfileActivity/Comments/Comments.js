import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ProfileActivityAccordionElem from '../ProfileActivityAccordionElem';
import CommentsQuestion from './CommentsQuestion';

const Comments = ({ comments = [], type = 'public' }) => {
  let [activeIndex, setActiveIndex] = useState(null);

  if (comments.length === 0) return <strong>Du har ingen kommentarer på dette semester.</strong>;
  let questions = [];

  // Select unique questions (because we load other user comments as well), remove unncessary nesting
  questions = _.uniqBy(comments, (comment) => comment.question.id).map((q) => q.question);

  if (type === 'private') {
    comments.map((comment) => {
      let questionIndex = _.findIndex(questions, { id: comment.questionId });
      comment = {
        id: comment.id,
        text: comment.text,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt
      };
      if (!questions[questionIndex].privateComments) {
        questions[questionIndex].privateComments = [comment];
      } else if (questions[questionIndex].privateComments.length < comments.length) {
        questions[questionIndex].privateComments.push(comment);
      }
    });
  }

  return (
    <div>
      {questions.length > 0 && <strong>Du har kommenteret følgende spørgsmål:</strong>}

      {questions.map((question, i) => {
        let questionComments;
        if (type === 'public') questionComments = question.publicComments;
        else questionComments = question.privateComments;

        return (
          <ProfileActivityAccordionElem
            key={question.id}
            title={question.text.substr(0, 80) + '...'}
            active={i === activeIndex}
            index={i}
            handleClick={setActiveIndex}
          >
            <CommentsQuestion question={question} comments={questionComments} />
          </ProfileActivityAccordionElem>
        );
      })}
    </div>
  );
};

Comments.propTypes = {
  /**
   * An array of comments
   */
  comments: PropTypes.array,

  /**
   * Om der vises offentlige eller private kommentarer
   */
  type: PropTypes.string
};
export default Comments;
