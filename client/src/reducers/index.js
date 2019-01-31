import { combineReducers } from 'redux';
import questionsReducer from './questionsReducer';
import settingsReducer from './settingsReducer';
import feedbackReducer from './feedbackReducer';
import authReducer from './authReducer';

export default combineReducers({
    questions: questionsReducer,
    settings: settingsReducer,
    feedback: feedbackReducer,
    auth: authReducer,
});
