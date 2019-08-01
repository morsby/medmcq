import { combineReducers } from 'redux';
import { localizeReducer } from 'react-localize-redux';
import quizReducer from './quizReducer';
import settingsReducer from './settingsReducer';
import authReducer from './authReducer';
import questionReducer from './questionReducer';
import metadataReducer from './metadataReducer';
import uiReducer from './uiReducer';
import shareBuilderReducer, { IShareBuilderState } from 'reducers/shareBuilderReducer';

export interface IReduxState {
  // TODO: Skal types ud fra reducers
  questions: any;
  metadata: any;
  ui: any;
  quiz: any;
  settings: any;
  auth: any;
  localize: any;
  shareBuilder: IShareBuilderState;
}

export default combineReducers({
  questions: questionReducer,
  metadata: metadataReducer,
  ui: uiReducer,
  // old reducers

  quiz: quizReducer,
  settings: settingsReducer,
  auth: authReducer,
  localize: localizeReducer,
  shareBuilder: shareBuilderReducer
});
