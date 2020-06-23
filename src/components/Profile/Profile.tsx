import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';
import { urls } from '../../utils/common';

import { Container, Button, Divider, Loader, Dropdown, Segment } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';

import { useHistory } from 'react-router';
import { ReduxState } from 'redux/reducers';
import ProfileClass from 'classes/Profile';
import Selection from 'classes/Selection';
import ProfileActivity from './ProfileActivity/ProfileActivity';

export interface ProfileProps {}

const Profile: React.SFC<ProfileProps> = () => {
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: ReduxState) => state.auth.user);
  const selectedSemester = useSelector((state: ReduxState) => state.selection.semesterId);
  const semesters = useSelector((state: ReduxState) => state.metadata.semesters);
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    ProfileClass.fetch({ semester: selectedSemester }).finally(() => {
      setLoading(false);
    });
  }, [selectedSemester]);

  const handleNavigation = (path: keyof typeof urls) => {
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
        <Dropdown
          options={semesters.map((s) => ({
            text: `${s.value}. semester - ${s.name.toTitleCase()}`,
            value: s.id,
            key: s.id
          }))}
          selection
          fluid
          value={selectedSemester}
          onChange={(e, { value }) => Selection.change({ type: 'semesterId', value })}
        />
        <Divider />
        {loading && (
          <Segment textAlign="center">
            <Loader inline active size="huge" />
            <p>Vi beregner din statistik. Vent venligst, det er klar om lidt &#128522;</p>
          </Segment>
        )}
        {!loading && (
          <Segment>
            <ProfileActivity />
          </Segment>
        )}
      </Container>
    </div>
  );
};

export default Profile;
