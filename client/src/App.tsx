import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Oversættelse
import { LocalizeContextProps, withLocalize } from 'react-localize-redux';
import { renderToStaticMarkup } from 'react-dom/server'; // required to initialize react-localize-redux
import authTranslations from './components/Auth/authTranslations.json'; // fordi der ikke er en gennemgående component i dette regi
import toastTranslations from 'redux/actions/toastTranslations.json';

// HOCs
import PrivateRoute from './components/Misc/HOC/PrivateRoute';
import ScrollToTop from './components/Misc/HOC/ScrollToTop';
// Routes
// Diverse
import ErrorPage from './components/Misc/Utility/404';
import Print from './components/Misc/Utility/Print/Print';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Selections
import Selection from './components/Selection/Selection';

// Selve quizzen
import Quiz from './components/Quiz/Quiz';
import About from './components/Misc/Utility/About/About';
import Contact from './components/Misc/Utility/Contact';

// Auth
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import Logout from './components/Auth/Logout';
import Profile from './components/Profile/Profile';
import EditProfile from './components/Forms/EditProfile';
import ForgotPassword from './components/Forms/ForgotPassword';
import ResetPassword from './components/Forms/ResetPassword';

// NewVersionMessage
import NewVersionMessage from './components/Misc/Utility/About/NewVersion/NewVersionMessage';

import { urls } from './utils/common';
import QuizShareRoute from 'components/Quiz/QuizShareRoute';
import QuizShareBuilderLoader from 'components/Quiz/QuizShareBuilderLoader';
import Sharebuilder from 'components/Sharebuilder/Sharebuilder';
import { toast } from 'react-toastify';
import FirstTimeToast from 'components/Misc/Utility/About/FirstTime/FirstTimeToast';
import FirstTime from 'components/Misc/Utility/About/FirstTime/FirstTime';
import User from 'classes/User';
import { ReduxState } from 'redux/reducers/index';
import settingsReducer from 'redux/reducers/settings';
import Layout from 'components/Layout/Layout';

export interface AppProps extends LocalizeContextProps {}

const App: React.SFC<AppProps> = ({ addTranslation, initialize }) => {
  const dispatch = useDispatch();
  const language = useSelector((state: ReduxState) => state.settings.language);
  const firstTime = useSelector((state: ReduxState) => state.settings.firstTime);

  useEffect(() => {
    // Hent brugeren
    User.fetch();

    dispatch(addTranslation(authTranslations));
    dispatch(addTranslation(toastTranslations));

    const languages = ['dk', 'gb'];
    const defaultLanguage = language || languages[0];

    dispatch(
      initialize({
        languages: [
          { name: 'Danish', code: 'dk' },
          { name: 'English', code: 'gb' }
        ],
        options: {
          renderToStaticMarkup,
          renderInnerHtml: true,
          defaultLanguage
        }
      })
    );

    if (firstTime) {
      toast.success(<FirstTimeToast language={defaultLanguage} />, {
        autoClose: false,
        onClose: () => dispatch(settingsReducer.actions.setFirstTime(false)),
        closeOnClick: false
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop>
        <NewVersionMessage />
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          draggable
          pauseOnHover
        />
        <Layout>
          <Switch>
            <Route path={'/firsttime'} component={FirstTime} />
            <Route path={urls.about} component={About} />
            <Route path={urls.contact} component={Contact} />
            <Route path={'/share/:id'} component={QuizShareBuilderLoader} />
            <Route path={'/share'} component={Sharebuilder} />
            <Route path={urls.quizShareRoute} component={QuizShareRoute} />
            <Route path={urls.quiz} component={Quiz} />
            <Route path={urls.signup} component={Signup} />
            <Route path={urls.login} component={Login} />
            <Route path={urls.logout} component={Logout} />
            <PrivateRoute path={urls.editProfile} component={EditProfile} />
            <PrivateRoute path={urls.profile} component={Profile} />
            <Route path={urls.forgotPassword} component={ForgotPassword} />
            <Route path={`${urls.resetPassword}/:token`} component={ResetPassword} />
            <Route path="/print" component={Print} />
            <Route exact path="/" component={Selection} />
            <Route component={ErrorPage} />
          </Switch>
        </Layout>
      </ScrollToTop>
    </BrowserRouter>
  );
};

export default withLocalize(App);
