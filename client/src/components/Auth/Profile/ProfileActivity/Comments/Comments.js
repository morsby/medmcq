import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ProfileActivityAccordionElem from '../ProfileActivityAccordionElem';
import CommentsQuestion from './CommentsQuestion';

const Comments = ({ questions = [], type = 'public' }) => {
  let [activeIndex, setActiveIndex] = useState(null);

  if (questions.length === 0)
    return <div>Du har ingen kommentarer på dette semester.</div>;

  return (
    <div>
      {questions.map((question, i) => {
        let questionComments;
        if (type === 'public') questionComments = question.publicComments;
        else questionComments = question.privateComments;

        return (
          <ProfileActivityAccordionElem
            key={question.id}
            title={question.text}
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
   * An array of questions that are commented by the user.
   */
  questions: PropTypes.array,

  /**
   * Om der vises offentlige eller private kommentarer
   */
  type: PropTypes.string
};
export default Comments;
