import { combineReducers } from 'redux';
import questionsReducer from './questionsReducer';
import answersReducer from './answersReducer';
import settingsReducer from './settingsReducer';

export default combineReducers({
	questions: questionsReducer,
	answers: answersReducer,
	settings: settingsReducer
});
