import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { urls } from '../../utils/common';
import _ from 'lodash';

import { Container, Tab, Button, Divider } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';

import ProfileActivity from './ProfileActivity/ProfileActivity';
import { useHistory } from 'react-router';
import { ReduxState } from 'redux/reducers';
import User from 'classes/User';
import uiReducer from 'redux/reducers/ui';
import Semester from 'classes/Semester';

export interface ProfileProps {}

const Profile: React.SFC<ProfileProps> = () => {
  const [loading, setLoading] = useState(true);
  const [width, setWidth] = useState(window.innerWidth);
  const { user } = useSelector((state: ReduxState) => state.auth);
  const [panes, setPanes] = useState([]);
  const selectedSemester = useSelector((state: ReduxState) => state.ui.selection.semesterId);
  const currentLanguage = useSelector((state: ReduxState) => state.settings.language);
  const semesters = useSelector((state: ReduxState) => state.metadata.semesters);
  const history = useHistory();
  const dispatch = useDispatch();

  /**
   * HandleResize and debounce it
   */
  let handleResize = () => setWidth(window.innerWidth);
  handleResize = _.debounce(handleResize, 300);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      await User.getProfileData({ semester: selectedSemester });
      setLoading(false);
    };

    fetchProfile();
  }, [selectedSemester]);

  useEffect(() => {
    const generatePaneLabel = (semester: Semester) => {
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
    semesters.map((semester) =>
      panes.push({
        menuItem: generatePaneLabel(semester),
        render: () => <Tab.Pane loading={loading}>{!loading && <ProfileActivity />}</Tab.Pane>
      })
    );

    setPanes(panes);
  }, [loading]);

  const handleTabChange = (e, { activeIndex }) => {
    const semesterId = semesters[activeIndex].id;
    dispatch(uiReducer.actions.changeSelection({ type: 'semesterId', value: semesterId }));
  };

  const handleNavigation = (path) => {
    history.push(urls[path]);
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
          activeIndex={semesters.findIndex((semester) => semester.id === selectedSemester)}
          onTabChange={handleTabChange}
        />
      </Container>
    </div>
  );
};

export default Profile;
