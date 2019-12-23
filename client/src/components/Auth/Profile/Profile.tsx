import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { urls } from '../../../utils/common';
import _ from 'lodash';

import { Container, Tab, Button, Divider } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';

import ProfileActivity from './ProfileActivity/ProfileActivity';
import { useHistory } from 'react-router';
import { ReduxState } from 'redux/reducers';
import User from 'classes/User';
import uiReducer from 'redux/reducers/ui';

export interface ProfileProps {}

const Profile: React.SFC<ProfileProps> = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const { profile, user, isFetching, didInvalidate } = useSelector(
    (state: ReduxState) => state.auth
  );
  const [panes, setPanes] = useState([]);
  const selectedSemester = useSelector((state: ReduxState) => state.ui.selection.semesterId);
  const currentLanguage = useSelector((state: ReduxState) => state.settings.language);
  const semesters = useSelector((state: ReduxState) => state.metadata.semesters);
  const questions = useSelector((state: ReduxState) => state.questions);
  const history = useHistory();
  const dispatch = useDispatch();

  /**
   * HandleResize and debounce it
   */
  let handleResize = () => setWidth(window.innerWidth);
  handleResize = _.debounce(handleResize, 300);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    dispatch(User.getProfileData({ semester: selectedSemester }));

    return window.removeEventListener('resize', handleResize);
  }, [dispatch, selectedSemester]);

  useEffect(() => {
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

    let panes = [];
    _.map(semesters, (e) =>
      panes.push({
        menuItem: generatePaneLabel(e),
        render: () => (
          <Tab.Pane loading={isFetching}>
            {!isFetching && !didInvalidate && <ProfileActivity />}
          </Tab.Pane>
        )
      })
    );

    setPanes(panes);
  }, [
    currentLanguage,
    didInvalidate,
    isFetching,
    profile.answers,
    profile.privateComments,
    profile.publicComments,
    questions,
    semesters,
    width
  ]);

  const handleTabChange = (e, { activeIndex }) => {
    const semesterId = Number(Object.keys(semesters)[activeIndex]);
    dispatch(uiReducer.actions.changeSelection({ type: 'semesterId', value: semesterId }));
    dispatch(User.getProfileData({ semester: semesterId }));
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
