import React, { useEffect, Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Translation
import { LocalizeContextProps, withLocalize } from 'react-localize-redux';
import { renderToStaticMarkup } from 'react-dom/server'; // required to initialize react-localize-redux
import authTranslations from './components/Auth/authTranslations.json'; // fordi der ikke er en gennemgående component i dette regi
import toastTranslations from 'redux/actions/toastTranslations.json';

// HOCs
import PrivateRoute from './components/Misc/HOC/PrivateRoute';
import ScrollToTop from './components/Misc/HOC/ScrollToTop';
// Misc
import ErrorPage from './components/Misc/Utility/404';
import Print from './components/Misc/Utility/Print/Print';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { urls } from './utils/common';
import { toast } from 'react-toastify';
import { ReduxState } from 'redux/reducers/index';
import settingsReducer from 'redux/reducers/settings';
import { hotjar } from 'react-hotjar';

// Classes
import User from 'classes/User';

// Components
import LoadingPage from 'components/Misc/Utility/LoadingPage';
import Layout from 'components/Layout/Layout';
import NewVersionMessage from './components/Misc/Utility/About/NewVersion/NewVersionMessage';

// Lazy components
const Selection = lazy(() => import('./components/Selection/Selection'));
const Quiz = lazy(() => import('./components/Quiz/Quiz'));
const About = lazy(() => import('./components/Misc/Utility/About/About'));
const Contact = lazy(() => import('./components/Misc/Utility/Contact'));
const Signup = lazy(() => import('./components/Auth/Signup'));
const Login = lazy(() => import('./components/Auth/Login'));
const Logout = lazy(() => import('./components/Auth/Logout'));
const Profile = lazy(() => import('./components/Profile/Profile'));
const EditProfile = lazy(() => import('./components/Forms/EditProfile'));
const ForgotPassword = lazy(() => import('./components/Forms/ForgotPassword'));
const ResetPassword = lazy(() => import('./components/Forms/ResetPassword'));
const QuizShareRoute = lazy(() => import('components/Quiz/QuizShareRoute'));
const QuizShareBuilderLoader = lazy(() => import('components/Quiz/QuizShareBuilderLoader'));
const Sharebuilder = lazy(() => import('components/Sharebuilder/Sharebuilder'));
const FirstTimeToast = lazy(() => import('components/Misc/Utility/About/FirstTime/FirstTimeToast'));
const FirstTime = lazy(() => import('components/Misc/Utility/About/FirstTime/FirstTime'));
const CreateQuestionForm = lazy(() => import('components/CreateQuestion/CreateQuestionForm'));
const SharebuilderPicker = lazy(() => import('components/Sharebuilder/ShareBuilderPicker'));
const SharebuilderLinks = lazy(() => import('components/Sharebuilder/SharebuilderLinks'));

export interface AppProps extends LocalizeContextProps {}

const App: React.SFC<AppProps> = ({ addTranslation, initialize }) => {
  const dispatch = useDispatch();
  const language = useSelector((state: ReduxState) => state.settings.language);
  const firstTime = useSelector((state: ReduxState) => state.settings.firstTime);
  const user = useSelector((state: ReduxState) => state.auth.user);

  hotjar.initialize(1757351, 6);

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
      <Suspense
        fallback={
          <Layout>
            <LoadingPage />
          </Layout>
        }
      >
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
              <Route path={'/share/search'} component={Sharebuilder} />
              <Route path={'/share/links'} component={SharebuilderLinks} />
              <Route path={'/share/:id'} component={QuizShareBuilderLoader} />
              <Route path={'/share'} component={SharebuilderPicker} />
              <Route path={urls.quizShareRoute} component={QuizShareRoute} />
              <Route path={urls.quiz} component={Quiz} />
              <Route path={urls.signup} component={Signup} />
              <Route path={urls.login} component={Login} />
              <Route path={urls.logout} component={Logout} />
              {user?.role.id < 3 && <Route path="/createquestion" component={CreateQuestionForm} />}
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
      </Suspense>
    </BrowserRouter>
  );
};

export default withLocalize(App);
