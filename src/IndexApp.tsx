import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
// GraphQL
import { Provider as UrqlProvider } from 'urql';
import urqlClient from 'urqlClient';
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
import ErrorBoundary from 'components/Misc/Utility/ErrorBoundary';

// Components
import LocalizedApp from './App';
import LoadingPage from './components/Misc/Utility/LoadingPage';

// Utils
import 'proto/string';

// STYLING
import './styles/scss/main.scss';
// Lightbox css
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app

const migrations: any = {
  10: (state: ReduxState) => ({
    ...state,
    questions: null as any
  }),
  11: (state: ReduxState) => ({}),
  12: (state: ReduxState) => ({ ...state, shareBuilder: {} })
};

const persistConfig = {
  key: 'medMCQ',
  storage: storage,
  stateReconciler: autoMergeLevel2, // see "Merge Process" section for details.
  version: 12,
  migrate: createMigrate(migrations),
  blacklist: ['auth', 'profile']
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
        <UrqlProvider value={urqlClient}>
          <LocalizeProvider store={store}>
            <LocalizedApp />
          </LocalizeProvider>
        </UrqlProvider>
      </PersistGate>
    </Provider>
  </ErrorBoundary>,
  document.querySelector('#root')
);

serviceWorker.unregister();
