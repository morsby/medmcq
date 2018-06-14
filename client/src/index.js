import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import reducers from './reducers';

import MCQ from './components/MCQ';
import MCQSelector from './components/MCQSelector';
import AddQuestion from './components/AddQuestion';

import './styles/css/main.css';

import registerServiceWorker from './registerServiceWorker';

const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<Switch>
				<Route path="/mcq" component={MCQ} />
				<Route path="/add" component={AddQuestion} />
				<Route path="/" component={MCQSelector} />
			</Switch>
		</BrowserRouter>
	</Provider>,
	document.querySelector('#root')
);

registerServiceWorker();
