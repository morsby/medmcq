import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';

import { Accordion, Icon } from 'semantic-ui-react';
import ProfileActivityAccordionElem from './ProfileActivityAccordionElem';

import Answers from './Answers/Answers';

/**
 * A Component that displays profile activities.
 */
const ProfileActivity = ({ answers = [] }) => {
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
      <Accordion.Title active={activeIndex === 1} index={1} onClick={() => setActiveIndex(1)}>
        <Icon name="dropdown" />
        ....
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 1}>
        <p>Placeholder</p>
      </Accordion.Content>
    </Accordion>
  );
};

ProfileActivity.propTypes = {
  /**
   * An array containing answers for the semester.
   */
  answers: PropTypes.array
};

export default ProfileActivity;
