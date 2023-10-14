// ** React Imports
import { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet';
import { PersistGate } from 'redux-persist/integration/react';
import axios from 'axios';

// ** Intl, CASL & ThemeColors Context
import { ToastContainer } from 'react-toastify';
import ability from './configs/acl/ability';
import { AbilityContext } from './utility/context/Can';
import { ThemeContext } from './utility/context/ThemeColors';
// import { IntlProviderWrapper } from './utility/context/Internationalization';

// eslint-disable-next-line no-unused-vars
import { store, persistor } from './redux/storeConfig/store';
// import Spinner from './@core/components/spinner/Fallback-spinner';
import Spinner from './components/FallbackSpinner';

import './@core/components/ripple-button';

// ** PrismJS
import 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-jsx.min';

// ** React Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css';

// ** React Toastify
import '@styles/react/libs/toastify/toastify.scss';

// ** Core styles
import './@core/assets/fonts/feather/iconfont.css';
import './@core/scss/core.scss';
import './assets/scss/style.scss';

// ** Service Worker
import * as serviceWorker from './serviceWorker';

// ** Lazy load app
const LazyApp = lazy(() => import('./App'));
ReactDOM.render(
  <Provider store={store}>

    <Suspense fallback={<Spinner />}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
      <AbilityContext.Provider value={ability}>
        <ThemeContext>
          <Helmet>
            <title>Canteen Hub</title>
          </Helmet>
          <LazyApp />
          <ToastContainer newestOnTop />
        </ThemeContext>
      </AbilityContext.Provider>
      {/* </PersistGate> */}
    </Suspense>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
