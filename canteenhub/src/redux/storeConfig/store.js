// ** Redux, Thunk & Root Reducer Imports
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import createDebounce from 'redux-debounced';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers/rootReducer';

const persistConfig = {
  key: 'root',
  storage,
};

// ** init middleware
const middleware = [thunk, createDebounce()];

// ** Dev Tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// ** Persistance reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ** Create store
const store = createStore(persistedReducer, {}, composeEnhancers(applyMiddleware(...middleware)));
const persistor = persistStore(store);

export { store, persistor };
// export { store };
