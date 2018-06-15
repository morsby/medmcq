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
import MCQ from './components/MCQ';
import MCQSelector from './components/MCQSelector';
import AddQuestion from './components/AddQuestion';
import LoadingPage from './components/LoadingPage';
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
				<Switch>
					<Route path={urls.quiz} component={MCQ} />
					<Route path={urls.add} component={AddQuestion} />
					<Route path="/" component={MCQSelector} />
				</Switch>
			</BrowserRouter>
		</PersistGate>
	</Provider>,
	document.querySelector('#root')
);

registerServiceWorker();
