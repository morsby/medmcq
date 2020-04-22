import { combineReducers } from 'redux';
import authReducer from './auth';
import metadataReducer from './metadata';
import questionsReducer from './question';
import quizReducer from './quiz';
import settingsReducer from './settings';
import shareBuilderReducer from './sharebuilder';
import { localizeReducer } from 'react-localize-redux';
import selectionReducer from './selection';
import profileReducer from './profile';

const rootReducer = combineReducers({
  auth: authReducer.reducer,
  metadata: metadataReducer.reducer,
  questions: questionsReducer.reducer,
  quiz: quizReducer.reducer,
  settings: settingsReducer.reducer,
  shareBuilder: shareBuilderReducer.reducer,
  selection: selectionReducer.reducer,
  profile: profileReducer.reducer,
  localize: localizeReducer
});

export type ReduxState = ReturnType<typeof rootReducer>;

export default rootReducer;
