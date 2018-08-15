import React from 'react';
import ReactDOM from 'react-dom';

// Redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import reducers from './reducers';

import { PersistGate } from 'redux-persist/lib/integration/react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ScrollToTop from './components/Misc/ScrollToTop';
import LoadingPage from './components/Misc/LoadingPage';

// Routes
import QuizMain from './components/Quiz/QuizMain';

import SelectionMain from './components/SelectionSettings/SelectionMain';

import QuestionAdd from './components/Quiz/QuestionAdd';

import FeedbackList from './components/Feedback/FeedbackList';
import FeedbackSingle from './components/Feedback/FeedbackSingle';
import FeedbackPost from './components/Feedback/FeedbackPost';

import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import Logout from './components/Auth/Logout';
import Profile from './components/Auth/Profile';

import { urls } from './common';

import './styles/css/main.css';

import registerServiceWorker from './registerServiceWorker';

const persistConfig = {
	key: 'root',
	storage: storage,
	stateReconciler: autoMergeLevel2 // see "Merge Process" section for details.
};

const pReducer = persistReducer(persistConfig, reducers);

const store = createStore(pReducer, {}, applyMiddleware(reduxThunk));
export const persistor = persistStore(store);

ReactDOM.render(
	<Provider store={store}>
		<PersistGate loading={<LoadingPage />} persistor={persistor}>
			<BrowserRouter>
				<ScrollToTop>
					<Switch>
						<Route
							path={`${urls.feedback}/new`}
							component={FeedbackPost}
						/>
						<Route
							path={`${urls.feedback}/:id`}
							component={FeedbackSingle}
						/>
						<Route path={urls.feedback} component={FeedbackList} />
						<Route path={urls.add} component={QuestionAdd} />
						<Route path={urls.quiz} component={QuizMain} />
						<Route path={urls.signup} component={Signup} />
						<Route path={urls.login} component={Login} />
						<Route path={urls.logout} component={Logout} />
						<Route path={urls.profile} component={Profile} />
						<Route path="/" component={SelectionMain} />
					</Switch>
				</ScrollToTop>
			</BrowserRouter>
		</PersistGate>
	</Provider>,
	document.querySelector('#root')
);

registerServiceWorker();
