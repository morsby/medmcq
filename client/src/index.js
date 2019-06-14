import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
// Redux
import { Provider } from 'react-redux';
import { createMigrate, persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { PersistGate } from 'redux-persist/lib/integration/react';
import reducers from './reducers';

// Oversættelse
import { LocalizeProvider } from 'react-localize-redux';

// Components
import LocalizedApp from './App';
import LoadingPage from './components/Misc/Utility-pages/LoadingPage';

// STYLING
import './styles/css/main.css';
import './semantic/dist/semantic.min.css';
// Lightbox css
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app

// redux
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';

const migrations = {
  6: (state) => {
    return {
      auth: state.auth,
      questions: state.questions
    };
  },
  7: () => ({})
};

const persistConfig = {
  key: 'medMCQ',
  storage: storage,
  stateReconciler: autoMergeLevel2, // see "Merge Process" section for details.
  version: 7,
  migrate: createMigrate(migrations),
  whitelist: [] // to disable persists
};

const pReducer = persistReducer(persistConfig, reducers);

// Redux middleware
let middleware = getDefaultMiddleware();
/**
 * removes createSerializableStateInvariantMiddleware which threw a bunch of errs
 * over react-localize-redux and redux-persist.
 */
if (middleware.length > 1) middleware.pop();

export const store = configureStore({
  reducer: pReducer,
  middleware,
  devTools: { maxAge: 20 }
});

export const persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={<LoadingPage />} persistor={persistor}>
      <LocalizeProvider store={store}>
        <LocalizedApp />
      </LocalizeProvider>
    </PersistGate>
  </Provider>,
  document.querySelector('#root')
);

serviceWorker.unregister();
