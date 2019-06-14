import { combineReducers } from 'redux';
import { localizeReducer } from 'react-localize-redux';
import quizReducer from './quizReducer';
import settingsReducer from './settingsReducer';
import selectionReducer from './selectionReducer';
import authReducer from './authReducer';
import questionReducer from './questionReducer';
import loadingReducer from './loadingReducer';
import metadataReducer from './metadataReducer';

export default combineReducers({
  question: questionReducer,
  metadata: metadataReducer,

  // old reducers

  quiz: quizReducer,
  settings: settingsReducer,
  selection: selectionReducer,
  auth: authReducer,
  localize: localizeReducer,
  loading: loadingReducer
});
