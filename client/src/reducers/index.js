import { combineReducers } from 'redux';
import questionsReducer from './questionsReducer';
import answersReducer from './answersReducer';

export default combineReducers({
	questions: questionsReducer,
	answers: answersReducer
});
