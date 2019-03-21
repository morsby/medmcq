import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
// Redux
import { Provider, connect } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import reducers from './reducers';

import { PersistGate } from 'redux-persist/lib/integration/react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Oversættelse
import { LocalizeProvider, withLocalize } from 'react-localize-redux';
import { renderToStaticMarkup } from 'react-dom/server'; // required to initialize react-localize-redux
import authTranslations from './components/Auth/authTranslations'; // fordi der ikke er en gennemgående component i dette regi

// HOCs
import PrivateRoute from './components/Misc/HOC/PrivateRoute';
import ScrollToTop from './components/Misc/HOC/ScrollToTop';
// Routes
// Diverse
import LoadingPage from './components/Misc/Pages/LoadingPage';
import ErrorPage from './components/Misc/Pages/404';
import Print from './components/Misc/Pages/Print/Print';
// Selections
import SelectionMain from './components/SelectionSettings/Selection';

// Selve quizzen
import Quiz from './components/Quiz/Quiz';

import About from './components/Misc/Pages/About/About';
import Contact from './components/Misc/Pages/Contact';

// Auth
import Signup from './components/Auth/Signup/Signup';
import Login from './components/Auth/Login/Login';
import Logout from './components/Auth/Logout/Logout';
import Profile from './components/Auth/Profile/Profile';
import EditProfile from './components/Auth/Profile/EditProfile';
import ForgotPassword from './components/Auth/Password/ForgotPassword';
import ResetPassword from './components/Auth/Password/ResetPassword';

import { urls } from './utils/common';

import './styles/css/main.css';
import './semantic/dist/semantic.min.css';
// Lightbox css
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import Header from './components/Layout/Header';

const persistConfig = {
  key: 'root',
  storage: storage,
  stateReconciler: autoMergeLevel2 // see "Merge Process" section for details.
};

const pReducer = persistReducer(persistConfig, reducers);

let middleware = getDefaultMiddleware();

/**
 * removes createSerializableStateInvariantMiddleware which threw a bunch of errs
 * over react-localize-redux and redux-persist.
 */
if (middleware.length > 1) middleware.pop();

export const store = configureStore({
  reducer: pReducer,
  middleware,
  devTools: true
});

export const persistor = persistStore(store);

class App extends Component {
  state = { maintenance: false };

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
    if (this.state.maintenance)
      return (
        <div style={{ textAlign: 'center', marginTop: '40vh' }}>
          <h1>MedMCQ</h1>
          <h2>
            Vi er ved at arbejde på siden, og tilføjer spændende og nye funktioner, som du snart kan
            nyde godt af.
          </h2>
          <h2>Vi er snart tilbage!</h2>
          <h5>- Sigurd Morsby og Thomas Jensen</h5>
        </div>
      );
    return (
      <BrowserRouter>
        <ScrollToTop>
          <Header />
          <Switch>
            <Route exact path="/" component={SelectionMain} />
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
        </ScrollToTop>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => ({
  defaultLanguage: state.settings.language
});

const LocalizedApp = withLocalize(connect(mapStateToProps)(App));

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={<LoadingPage />} persistor={persistor}>
      <LocalizeProvider store={store}>
        <LocalizedApp />
      </LocalizeProvider>
    </PersistGate>
  </Provider>,
  document.querySelector('#root')
);

serviceWorker.unregister();
