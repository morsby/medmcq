import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';

import { Accordion } from 'semantic-ui-react';
import ProfileActivityAccordionElem from './ProfileActivityAccordionElem';

import Answers from './Answers/Answers';
import Bookmarks from './Bookmarks/Bookmarks';
import Comments from './Comments/Comments';

/**
 * A Component that displays profile activities for a single semester.
 */
const ProfileActivity = ({
  answers = [],
  publicComments = [],
  privateComments = [],
  bookmarks = []
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
            <Answers answers={answers} />
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
            <Comments questions={publicComments} />
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
            <Comments questions={privateComments} type="private" />
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
            <Bookmarks bookmarks={bookmarks} />
          </ProfileActivityAccordionElem>
        )}
      </Translate>
    </Accordion>
  );
};

ProfileActivity.propTypes = {
  /**
   * An array containing answers for the semester.
   */
  answers: PropTypes.array,

  /**
   * An arary of public comments
   */
  publicComments: PropTypes.array,
  /**
   * An arary of private comments
   */
  privateComments: PropTypes.array,

  /**
   * An arary of bookmarked questions comments
   */
  bookmarks: PropTypes.array
};

export default ProfileActivity;
