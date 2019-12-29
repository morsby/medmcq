import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';

import { Accordion } from 'semantic-ui-react';
import ProfileActivityAccordionElem from './ProfileActivityAccordionElem';

import Answers from './Answers/Answers';
import Bookmarks from './Bookmarks/Bookmarks';
import Comments from './Comments/Comments';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';

/**
 * A Component that displays profile activities for a single semester.
 */
export interface ProfileActivityProps {}

const ProfileActivity: React.SFC<ProfileActivityProps> = () => {
  const { publicComments, privateComments } = useSelector(
    (state: ReduxState) => state.auth.profile
  );

  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <Accordion fluid styled>
      <Translate>
        {({ translate }) => (
          <ProfileActivityAccordionElem
            title={translate('profileActivity.accordionElements.answers') as string}
            index={0}
            active={activeIndex === 0}
            handleClick={setActiveIndex}
          >
            <Answers />
          </ProfileActivityAccordionElem>
        )}
      </Translate>
      <Translate>
        {({ translate }) => (
          <ProfileActivityAccordionElem
            title={translate('profileActivity.accordionElements.publicComments') as string}
            index={1}
            active={activeIndex === 1}
            handleClick={setActiveIndex}
          >
            <Comments comments={publicComments} />
          </ProfileActivityAccordionElem>
        )}
      </Translate>
      <Translate>
        {({ translate }) => (
          <ProfileActivityAccordionElem
            title={translate('profileActivity.accordionElements.privateComments') as string}
            index={2}
            active={activeIndex === 2}
            handleClick={setActiveIndex}
          >
            <Comments comments={privateComments} />
          </ProfileActivityAccordionElem>
        )}
      </Translate>
      <Translate>
        {({ translate }) => (
          <ProfileActivityAccordionElem
            title={translate('profileActivity.accordionElements.bookmarks') as string}
            index={3}
            active={activeIndex === 3}
            handleClick={setActiveIndex}
          >
            <Bookmarks />
          </ProfileActivityAccordionElem>
        )}
      </Translate>
    </Accordion>
  );
};

export default ProfileActivity;
