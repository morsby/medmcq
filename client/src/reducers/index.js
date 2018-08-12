import { combineReducers } from 'redux';
import questionsReducer from './questionsReducer';
import answersReducer from './answersReducer';
import settingsReducer from './settingsReducer';
import feedbackReducer from './feedbackReducer';
import authReducer from './authReducer';

export default combineReducers({
	questions: questionsReducer,
	answers: answersReducer,
	settings: settingsReducer,
	feedback: feedbackReducer,
	auth: authReducer
});
