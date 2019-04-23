import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Oversættelse
import { withLocalize } from 'react-localize-redux';
import { renderToStaticMarkup } from 'react-dom/server'; // required to initialize react-localize-redux
import authTranslations from './components/Auth/authTranslations'; // fordi der ikke er en gennemgående component i dette regi

// HOCs
import PrivateRoute from './components/Misc/HOC/PrivateRoute';
import ScrollToTop from './components/Misc/HOC/ScrollToTop';
// Routes
// Diverse
import ErrorPage from './components/Misc/Pages/404';
import Print from './components/Misc/Pages/Print/Print';
// Selections
import Selection from './components/SelectionSettings/Selection';

// Selve quizzen
import Quiz from './components/Quiz/Quiz';
import About from './components/Misc/Pages/About/About';
import Contact from './components/Misc/Pages/Contact';

import Header from './components/Layout/Header';

// Auth
import Signup from './components/Auth/Signup/Signup';
import Login from './components/Auth/Login/Login';
import Logout from './components/Auth/Logout/Logout';
import Profile from './components/Auth/Profile/Profile';
import EditProfile from './components/Auth/Profile/EditProfile';
import ForgotPassword from './components/Auth/Password/ForgotPassword';
import ResetPassword from './components/Auth/Password/ResetPassword';

// NewVersionMessage
import NewVersionMessage from './components/Misc/Pages/About/NewVersion/NewVersionMessage';

import * as actions from './actions';
import { urls, breakpoints } from './utils/common';
import { Responsive } from 'semantic-ui-react';
import Sidebar from './components/Layout/Sidebar';

class App extends Component {
  constructor(props) {
    super(props);

    this.props.addTranslation(authTranslations);

    const languages = ['dk', 'gb'];
    const defaultLanguage = this.props.defaultLanguage || languages[0];

    this.props.initialize({
      languages: [{ name: 'Danish', code: 'dk' }, { name: 'English', code: 'gb' }],
      options: {
        renderToStaticMarkup,
        renderInnerHtml: true,
        defaultLanguage
      }
    });
  }
  render() {
    return (
      <BrowserRouter>
        <ScrollToTop>
          <Header />
          <NewVersionMessage />
          <Sidebar>
            <Switch>
              <Route exact path="/" component={Selection} />
              <Route path={urls.about} component={About} />
              <Route path={urls.contact} component={Contact} />
              <Route path={urls.quiz} component={Quiz} />
              <Route path={urls.signup} component={Signup} />
              <Route path={urls.login} component={Login} />
              <Route path={urls.logout} component={Logout} />
              <PrivateRoute isLoggedIn={true} path={urls.editProfile} component={EditProfile} />
              <PrivateRoute path={urls.profile} component={Profile} />
              <Route path={urls.forgotPassword} component={ForgotPassword} />
              <Route path={`${urls.resetPassword}/:token`} component={ResetPassword} />
              <Route path="/print" component={Print} />
              <Route component={ErrorPage} />
            </Switch>
          </Sidebar>
        </ScrollToTop>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => ({
  defaultLanguage: state.settings.language
});

App.propTypes = {
  // All are about translations
  // The default language set by react-localize-redux
  defaultLanguage: PropTypes.string,

  // The func to add translation data
  addTranslation: PropTypes.func,

  // Initialize the translation, seeding into redux state
  initialize: PropTypes.func
};

const LocalizedApp = withLocalize(
  connect(
    mapStateToProps,
    actions
  )(App)
);

export default LocalizedApp;
