import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import axios from 'axios';

import { connect } from 'react-redux';
import * as actions from '../../../actions';
import { urls, semestre } from '../../../utils/common';
import { semesterIndices } from '../../../utils/auth';
import _ from 'lodash';

import { Container, Tab, Button, Divider } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';

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

    this.handleResize = _.debounce(this.handleResize, 300);
  }

  componentDidMount() {
    // const { user } = this.props.auth;
    this.getQuestions(this.state.semester);
    // this.getComments(user.comments); // TODO: Find en måde at vise kommentarerne bedre på
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => this.setState({ width: window.innerWidth });

  getQuestions = (semester) => {
    let answeredQuestions = _.get(this.props, ['auth', 'user', 'answeredQuestions', semester], {});

    this.props.getAnsweredQuestions(answeredQuestions);
  };

  getComments = async () => {
    const { data: comments } = await axios.post('/api/questions/ids', {
      ids: this.props.auth.user.comments
    });
    this.setState({ comments: comments });
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
            <li className="item">
              <Translate id="profile.activity.comments" data={{ n: user.comments.length }} />
            </li>
          </ul>
          {user.comments.length > 0 && (
            <Button basic onClick={() => this.startQuiz(user.comments)}>
              <Translate id="profile.activity.see_comments_link" />
            </Button>
          )}
        </div>

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
    _.map(semestre, (e) =>
      panes.push({
        menuItem: generatePaneLabel(e),
        render: () => <Tab.Pane>{this.generateTabContent(performance, user)}</Tab.Pane>
      })
    );

    return (
      <div className="flex-container">
        <Container className="content">
          <h2 style={{ textAlign: 'center' }}>
            <Translate
              id="profile.header"
              data={{ username: user.username[0].toUpperCase() + user.username.substring(1) }}
            />
          </h2>
          <Divider />
          <div style={{ textAlign: 'center' }}>
            <Button basic color="yellow" onClick={() => this.handleNavigation('editProfile')}>
              <Translate id="profile.buttons.edit_profile" />
            </Button>
          </div>
          <Divider hidden />
          <h3 style={{ textAlign: 'center' }}>
            <Translate id="profile.subheader" />
          </h3>
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
              comments={this.state.comments}
            />
          )}
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
