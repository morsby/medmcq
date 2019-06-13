import { combineReducers } from 'redux';
import { localizeReducer } from 'react-localize-redux';
import quizReducer from './quizReducer';
import settingsReducer from './settingsReducer';
import selectionReducer from './selectionReducer';
import authReducer from './authReducer';
import questionReducer from './questionReducer';
import loadingReducer from './loadingReducer';

export default combineReducers({
  quiz: quizReducer,
  settings: settingsReducer,
  selection: selectionReducer,
  auth: authReducer,
  localize: localizeReducer,
  question: questionReducer,
  loading: loadingReducer
});
