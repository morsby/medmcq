import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { urls } from '../../../utils/common';
import _ from 'lodash';

import { Container, Tab, Button, Divider } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';

import ProfileActivity from './ProfileActivity/ProfileActivity';
import { IReduxState } from 'reducers';
import { useHistory } from 'react-router';
import { changeSelection, getProfile } from 'actions';

export interface ProfileProps {}

const Profile: React.SFC<ProfileProps> = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const { profile, user, isFetching, didInvalidate } = useSelector(
    (state: IReduxState) => state.auth
  );
  const [panes, setPanes] = useState([]);
  const { selectedSemester } = useSelector((state: IReduxState) => state.ui.selection);
  const currentLanguage = useSelector((state: IReduxState) => state.settings.language);
  const { semesters } = useSelector((state: IReduxState) => state.metadata.entities);
  const { questions } = useSelector((state: IReduxState) => state.questions.entities);
  const history = useHistory();
  const dispatch = useDispatch();

  /**
   * HandleResize and debounce it
   */
  let handleResize = () => setWidth(window.innerWidth);
  handleResize = _.debounce(handleResize, 300);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    dispatch(getProfile(selectedSemester));

    return window.removeEventListener('resize', handleResize);
  }, [selectedSemester]);

  useEffect(() => {
    const panes = [];
    _.map(semesters, (e) =>
      panes.push({
        menuItem: generatePaneLabel(e),
        render: () => (
          <Tab.Pane loading={isFetching}>
            {!isFetching && !didInvalidate && (
              <ProfileActivity
                questions={questions}
                answers={profile.answers}
                publicComments={profile.publicComments}
                privateComments={profile.privateComments}
                bookmarks={profile.bookmarks}
              />
            )}
          </Tab.Pane>
        )
      })
    );

    setPanes(panes);
  }, [isFetching]);

  const generatePaneLabel = (semester) => {
    if (width < 480) {
      return `${semester.value}${currentLanguage === 'dk' ? '.' : 'th'}`;
    } else if (width < 768) {
      return `${semester.value}${currentLanguage === 'dk' ? '.' : 'th'} (${semester.name})`;
    } else {
      return `${semester.value}${currentLanguage === 'dk' ? '.' : 'th'} semester (${
        semester.name
      })`;
    }
  };

  const handleTabChange = (e, { activeIndex }) => {
    const semesterId = Number(Object.keys(semesters)[activeIndex]);
    dispatch(changeSelection('selectedSemester', semesterId));
    dispatch(getProfile(semesterId));
  };

  const handleNavigation = (path) => {
    history.push(urls[path]);
  };

  const findActiveIndex = (semesterId) => {
    return Object.keys(semesters).indexOf(String(semesterId));
  };

  return (
    <div className="flex-container">
      <Container className="content">
        <h2 style={{ textAlign: 'center' }}>
          <Translate
            id="profile.header"
            data={{
              username: user.username[0].toUpperCase() + user.username.substring(1)
            }}
          />
        </h2>
        <Divider />
        <div style={{ textAlign: 'center' }}>
          <Button basic color="yellow" onClick={() => handleNavigation('editProfile')}>
            <Translate id="profile.buttons.edit_profile" />
          </Button>
        </div>
        <Divider hidden />
        <h3 style={{ textAlign: 'center' }}>
          <Translate id="profile.subheader" />
        </h3>
        <Tab
          panes={panes}
          activeIndex={findActiveIndex(selectedSemester)}
          onTabChange={handleTabChange}
        />
      </Container>
    </div>
  );
};

export default Profile;
