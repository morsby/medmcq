import { combineReducers } from 'redux';
import authReducer from './auth';
import metadataReducer from './metadata';
import questionsReducer from './question';
import quizReducer from './quiz';
import settingsReducer from './settings';
import shareBuilderReducer from './sharebuilder';
import UIReducer from './ui';
import { localizeReducer } from 'react-localize-redux';

const rootReducer = combineReducers({
  auth: authReducer.reducer,
  metadata: metadataReducer.reducer,
  questions: questionsReducer.reducer,
  quiz: quizReducer.reducer,
  settings: settingsReducer.reducer,
  shareBuilder: shareBuilderReducer.reducer,
  ui: UIReducer.reducer,
  localize: localizeReducer
});

export type ReduxState = ReturnType<typeof rootReducer>;

export default rootReducer;