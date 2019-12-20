import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';

import { Accordion } from 'semantic-ui-react';
import ProfileActivityAccordionElem from './ProfileActivityAccordionElem';

import Answers from './Answers/Answers';
import Bookmarks from './Bookmarks/Bookmarks';
import Comments from './Comments/Comments';
import _ from 'lodash';

/**
 * A Component that displays profile activities for a single semester.
 */
const ProfileActivity = ({
  answers = {},
  publicComments = {},
  privateComments = {},
  bookmarks = {},
  questions = {}
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <Accordion fluid styled>
      <Translate>
        {({ translate }) => (
          <ProfileActivityAccordionElem
            title={translate('profileActivity.accordionElements.answers')}
            index={0}
            active={activeIndex === 0}
            handleClick={setActiveIndex}
          >
            <Answers
              answers={answers}
              questions={questions}
              publicComments={_.map(publicComments, (c) => c.id)}
              privateComments={_.map(privateComments, (c) => c.id)}
            />
          </ProfileActivityAccordionElem>
        )}
      </Translate>
      <Translate>
        {({ translate }) => (
          <ProfileActivityAccordionElem
            title={translate('profileActivity.accordionElements.publicComments')}
            index={1}
            active={activeIndex === 1}
            handleClick={setActiveIndex}
          >
            <Comments comments={publicComments} questions={questions} />
          </ProfileActivityAccordionElem>
        )}
      </Translate>
      <Translate>
        {({ translate }) => (
          <ProfileActivityAccordionElem
            title={translate('profileActivity.accordionElements.privateComments')}
            index={2}
            active={activeIndex === 2}
            handleClick={setActiveIndex}
          >
            <Comments comments={privateComments} questions={questions} type="private" />
          </ProfileActivityAccordionElem>
        )}
      </Translate>
      <Translate>
        {({ translate }) => (
          <ProfileActivityAccordionElem
            title={translate('profileActivity.accordionElements.bookmarks')}
            index={3}
            active={activeIndex === 3}
            handleClick={setActiveIndex}
          >
            <Bookmarks bookmarks={bookmarks} questions={questions} />
          </ProfileActivityAccordionElem>
        )}
      </Translate>
    </Accordion>
  );
};

ProfileActivity.propTypes = {
  /**
   * An object containing questions
   */
  questions: PropTypes.object,

  /**
   * An object containing answers for the semester.
   */
  answers: PropTypes.object,

  /**
   * An object of public comments
   */
  publicComments: PropTypes.object,
  /**
   * An object of private comments
   */
  privateComments: PropTypes.object,

  /**
   * An object of bookmarked questions comments
   */
  bookmarks: PropTypes.object
};

export default ProfileActivity;
