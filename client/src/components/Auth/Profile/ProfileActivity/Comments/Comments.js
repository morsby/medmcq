import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';

import ProfileActivityAccordionElem from '../ProfileActivityAccordionElem';
import CommentsQuestion from './CommentsQuestion';
import { Button } from 'semantic-ui-react';
import { withRouter } from 'react-router';

const Comments = ({ questions = {}, comments = {}, type = 'public', history }) => {
  let [activeIndex, setActiveIndex] = useState(null);

  if (Object.keys(comments).length === 0) return <Translate id="profileComments.no_comments" />;

  return (
    <div>
      {_.map(comments, (comment, i, allComments) => {
        let { questionId } = comment;

        let question = questions[questionId];

        i = Object.keys(allComments).indexOf(i);
        return (
          <>
            <ProfileActivityAccordionElem
              key={question.id}
              title={question.text}
              active={i === activeIndex}
              index={i}
              handleClick={setActiveIndex}
            >
              <CommentsQuestion question={question} type={type} />
            </ProfileActivityAccordionElem>
            <div style={{ textAlign: 'center', margin: '1rem' }}>
              <Button basic color="black" onClick={() => history.push(`/quiz/${question.id}`)}>
                <Translate id="profileActivity.accordionElements.accordionButton" />
              </Button>
            </div>
          </>
        );
      })}
    </div>
  );
};

Comments.propTypes = {
  /**
   * An object of questions that are commented by the user.
   */
  questions: PropTypes.object,

  comments: PropTypes.object,

  /**
   * Om der vises offentlige eller private kommentarer
   */
  type: PropTypes.string,
  history: PropTypes.object
};
export default withRouter(Comments);
