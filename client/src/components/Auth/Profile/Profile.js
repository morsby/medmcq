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

import Footer from '../../Layout/Footer';

import ProfileAnswerDetails from './ProfileAnswerDetails';

/**
 * Component der viser profilen.
 */
class Profile extends Component {
  constructor(props) {
    super(props);
    let { semester } = props.settings;

    this.state = {
      activeTab: semesterIndices(semester),
      details: true,
      hidden: null,
      semester: semester,
      width: window.innerWidth
    };
  }

  componentDidMount() {
    this.getQuestions(this.state.semester);
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => _.debounce(this.setState({ width: window.innerWidth }), 150);

  getQuestions = (semester) => {
    let answeredQuestions = _.get(this.props, ['auth', 'user', 'answeredQuestions', semester], {});

    this.props.getAnsweredQuestions(answeredQuestions);
  };

  handleTabChange = (e, { activeIndex }) => {
    let semester = semesterIndices(activeIndex);
    this.getQuestions(semester);
    this.setState({ activeTab: activeIndex, semester: semester });
  };

  toggleDetails = () => {
    this.setState({ details: !this.state.details });
  };

  handleNavigation = (path) => {
    this.props.history.push(urls[path]);
  };

  startQuiz = (ids) => {
    this.props.getQuestions({ type: 'ids' }, ids);
    this.handleNavigation('quiz');
  };

  generateTabContent = (performance, user) => {
    let totalAnswers = Object.keys(performance.answeredQuestions).length,
      { allRight, allWrong, mixed } = performance.summary;
    return (
      <div>
        <p>
          <strong>
            <Translate id="profile.activity.summary" data={{ total: totalAnswers }} />
          </strong>
        </p>
        <div>
          <p>
            <Translate id="profile.activity.answers.header" />
          </p>
          <ul className="ui list analysis">
            <li className="item">
              <Translate id="profile.activity.answers.correct" data={{ n: allRight.length }} />
            </li>
            <li className="item">
              <Translate id="profile.activity.answers.wrong" data={{ n: allWrong.length }} />
            </li>
            <li className="item">
              <Translate id="profile.activity.answers.mixed" data={{ n: mixed.length }} />
            </li>
          </ul>
        </div>
        <Divider hidden />
        <p>
          <Translate id="profile.activity.comments" data={{ n: user.comments.length }} />
        </p>
        {user.comments.length > 0 && (
          <Button basic onClick={() => this.startQuiz(user.comments)}>
            <Translate id="profile.activity.see_comments_link" />
          </Button>
        )}

        <Divider hidden />
        <Button onClick={this.toggleDetails} disabled={totalAnswers === 0}>
          {this.state.details ? (
            <Translate id="profile.details.hide_details" />
          ) : (
            <Translate id="profile.details.show_details" />
          )}
        </Button>
      </div>
    );
  };

  render() {
    const { performance, user } = this.props.auth,
      currentLanguage = this.props.settings.language,
      panes = [],
      generatePaneLabel = (semester) => {
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
    console.log(generatePaneLabel(semestre[0]));
    _.map(semestre, (e) =>
      panes.push({
        menuItem: generatePaneLabel(e),
        render: () => <Tab.Pane>{this.generateTabContent(performance, user)}</Tab.Pane>
      })
    );

    return (
      <div className="flex-container">
        <Container className="content">
          <h2>{user.username}</h2>
          <Button basic color="yellow" onClick={() => this.handleNavigation('editProfile')}>
            <Translate id="profile.buttons.edit_profile" />
          </Button>
          <Button
            floated="right"
            negative
            onClick={() => (window.location.href = '/api/auth/logout')}
          >
            <Translate id="profile.buttons.logout" />
          </Button>
          <Divider hidden />
          <p>
            <Translate id="profile.subheader" />
          </p>
          <Tab
            panes={panes}
            activeIndex={this.state.activeTab}
            onTabChange={this.handleTabChange}
          />

          {this.state.details && (
            <ProfileAnswerDetails
              performance={performance}
              filter={this.state.filter}
              language={currentLanguage}
            />
          )}
        </Container>
        <Footer />
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
   * Funktion der henter de spørgsmål, brugeren har svaret på. Fra redux
   */
  getAnsweredQuestions: PropTypes.func,

  /**
   * Fra react-router
   */
  history: ReactRouterPropTypes.history,

  /**
   * Brugeren. Fra redux
   */
  auth: PropTypes.object
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    settings: state.settings
  };
}

export default connect(
  mapStateToProps,
  actions
)(Profile);
