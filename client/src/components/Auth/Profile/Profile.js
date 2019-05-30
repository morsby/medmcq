import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { connect } from 'react-redux';
import * as actions from '../../../actions';
import { urls, semestre } from '../../../utils/common';
import { semesterIndices } from '../../../utils/auth';
import _ from 'lodash';

import { Container, Tab, Button, Divider } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';

import ProfileActivity from './ProfileActivity/ProfileActivity';
/**
 * Component der viser profilen.
 */
class Profile extends Component {
  constructor (props) {
    super(props);
    let { semester } = props.settings;

    this.state = {
      activeTab: semesterIndices(semester),
      semester: semester,
      width: window.innerWidth,
      comments: []
    };

    this.handleResize = _.debounce(this.handleResize, 300);
  }

  componentDidMount () {
    this.props.getProfile(this.props.auth.user.id);
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => this.setState({ width: window.innerWidth });

  handleTabChange = (e, { activeIndex }) => {
    let semester = semesterIndices(activeIndex);
    this.setState({ activeTab: activeIndex, semester: semester });
  };

  handleNavigation = (path) => {
    this.props.history.push(urls[path]);
  };

  render () {
    const { profile, user } = this.props.auth;

    const currentLanguage = this.props.settings.language;

    const panes = [];

    const generatePaneLabel = (semester) => {
      if (this.state.width < 480) {
        return `${semester.value}${currentLanguage === 'dk' ? '.' : 'th'}`;
      } else if (this.state.width < 768) {
        return `${semester.value}${currentLanguage === 'dk' ? '.' : 'th'} (${semester.name})`;
      } else {
        return `${semester.value}${currentLanguage === 'dk' ? '.' : 'th'} semester (${
          semester.name
        })`;
      }
    };

    _.map(semestre, (e) =>
      panes.push({
        menuItem: generatePaneLabel(e),
        render: () => (
          <Tab.Pane>
            <ProfileActivity
              answers={profile.answers[e.value]}
              publicComments={profile.publicComments[e.value]}
              privateComments={profile.privateComments[e.value]}
              bookmarks={profile.bookmarks[e.value]}
            />
          </Tab.Pane>
        )
      })
    );

    return (
      <div className='flex-container'>
        <Container className='content'>
          <h2 style={{ textAlign: 'center' }}>
            <Translate
              id='profile.header'
              data={{ username: user.username[0].toUpperCase() + user.username.substring(1) }}
            />
          </h2>
          <Divider />
          <div style={{ textAlign: 'center' }}>
            <Button basic color='yellow' onClick={() => this.handleNavigation('editProfile')}>
              <Translate id='profile.buttons.edit_profile' />
            </Button>
          </div>
          <Divider hidden />
          <h3 style={{ textAlign: 'center' }}>
            <Translate id='profile.subheader' />
          </h3>
          <Tab
            panes={panes}
            activeIndex={this.state.activeTab}
            onTabChange={this.handleTabChange}
          />
        </Container>
      </div>
    );
  }
}

Profile.propTypes = {
  /**
   * Settings object, fra redux
   */
  settings: PropTypes.object,

  /**
   * Funktion der starter en quiz med de valgte spg. (kommentarer!). Fra redux
   */
  getQuestions: PropTypes.func,

  /**
   * Funktion der henter en brugers profil (svar, kommentarer). Fra redux
   */
  getProfile: PropTypes.func,

  /**
   * Fra react-router
   */
  history: ReactRouterPropTypes.history,

  /**
   * Brugeren. Fra redux
   */
  auth: PropTypes.object
};

function mapStateToProps (state) {
  return {
    auth: state.auth,
    settings: state.settings
  };
}

export default connect(
  mapStateToProps,
  actions
)(Profile);
