import { combineReducers } from 'redux';
import { localizeReducer } from 'react-localize-redux';
import questionsReducer from './questionsReducer';
import settingsReducer from './settingsReducer';
import authReducer from './authReducer';

export default combineReducers({
    questions: questionsReducer,
    settings: settingsReducer,
    auth: authReducer,
    localize: localizeReducer
});
