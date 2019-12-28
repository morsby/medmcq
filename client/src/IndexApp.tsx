import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
// GraphQL
import { ApolloProvider } from 'react-apollo-hooks';
import apolloClient from 'apolloClient';
// Redux
import { Provider } from 'react-redux';
import { createMigrate, persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import { PersistGate } from 'redux-persist/lib/integration/react';

// Oversættelse
import { LocalizeProvider } from 'react-localize-redux';

// redux
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import rootReducer, { ReduxState } from 'redux/reducers';
import ErrorBoundary from 'components/Misc/Utility-pages/ErrorBoundary';

// Components
import LocalizedApp from './App';
import LoadingPage from './components/Misc/Utility-pages/LoadingPage';

// Utils
import 'proto/string';

// STYLING
import './styles/scss/main.scss';
// Lightbox css
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app

const migrations: any = {
  10: (state: ReduxState) => ({
    ...state,
    questions: null
  }),
  11: (state: ReduxState) => ({})
};

const persistConfig = {
  key: 'medMCQ',
  storage: storage,
  stateReconciler: autoMergeLevel2, // see "Merge Process" section for details.
  version: 11,
  migrate: createMigrate(migrations),
  whitelist: ['quiz', 'questions', 'metadata', 'ui', 'settings', 'shareBuilder'] // to disable persists
};

const pReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: pReducer,
  middleware: getDefaultMiddleware({ serializableCheck: false }),
  devTools: { maxAge: 20 }
});

export const persistor = persistStore(store);

ReactDOM.render(
  <ErrorBoundary>
    <Provider store={store}>
      <PersistGate loading={<LoadingPage />} persistor={persistor}>
        <ApolloProvider client={apolloClient}>
          <LocalizeProvider store={store}>
            <LocalizedApp />
          </LocalizeProvider>
        </ApolloProvider>
      </PersistGate>
    </Provider>
  </ErrorBoundary>,
  document.querySelector('#root')
);

serviceWorker.unregister();
