// ** React Imports
import {
  Suspense, useContext, lazy, useEffect, useState,
} from 'react';

// ** Utils
import { isUserLoggedIn, getUserData } from '@utils';
import { useLayout } from '@hooks/useLayout';
import { AbilityContext } from '@src/utility/context/Can';
import { useRouterTransition } from '@hooks/useRouterTransition';
import { headers } from '@configs/apiHeaders.js';
import { getMe } from '@store/actions/user.actions';

// ** Custom Components
// import Spinner from '@components/spinner/Loading-spinner' // Uncomment if your require content fallback
import LayoutWrapper from '@layouts/components/layout-wrapper';

// ** Router Components
import {
  BrowserRouter as AppRouter, Route, Switch, Redirect, useHistory,
} from 'react-router-dom';

// ** Routes & Default Routes

// ** Layouts
import BlankLayout from '@layouts/BlankLayout';
import VerticalLayout from '@src/layouts/VerticalLayout';
import HorizontalLayout from '@src/layouts/HorizontalLayout';
import PageLayout from '@src/layouts/PageLayout';

import IdleTimer from 'react-idle-timer';
import { handleLogout } from '@store/actions/auth';
import { useSelector, useDispatch } from 'react-redux';
import { DefaultRoute, Routes } from './routes';
import LandPage from '../views/pages/landPage/LandPage';
import SchoolPage from '../views/pages/landPage/Schools';
import ParentPage from '../views/pages/landPage/Parents';
import StorePage from '../views/pages/landPage/Store';

const Router = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  // ** Hooks
  const [layout, setLayout] = useLayout();
  const [transition, setTransition] = useRouterTransition();

  // ** ACL Ability Context
  const ability = useContext(AbilityContext);

  // ** Default Layout
  const DefaultLayout = layout === 'horizontal' ? 'HorizontalLayout' : 'VerticalLayout';

  // ** All of the available layouts
  const Layouts = {
    BlankLayout, VerticalLayout, HorizontalLayout, PageLayout,
  };

  // ** Current Active Item
  const currentActiveItem = null;

  // ** Return Filtered Array of Routes & Paths
  const LayoutRoutesAndPaths = (layout) => {
    const LayoutRoutes = [];
    const LayoutPaths = [];

    if (Routes) {
      Routes.filter((route) => {
        // ** Checks if Route layout or Default layout matches current layout
        if (route.layout === layout || (route.layout === undefined && DefaultLayout === layout)) {
          LayoutRoutes.push(route);
          LayoutPaths.push(route.path);
        }
      });
    }

    return { LayoutRoutes, LayoutPaths };
  };

  const NotAuthorized = lazy(() => import('@src/views/pages/misc/NotAuthorized'));

  // ** Init Error Component
  const Error = lazy(() => import('@src/views/pages/misc/Error'));

  const NotConnected = lazy(() => import('@src/views/pages/misc/Error'));
  const Error503 = lazy(() => import('@src/views/pages/misc/Error503'));

  /**
   ** Final Route Component Checks for Login & User Role and then redirects to the route
   */
  const FinalRoute = (props) => {
    const { route } = props;
    let action; let
      resource;

    // ** Assign vars based on route meta
    if (route.meta) {
      action = route.meta.action ? route.meta.action : null;
      resource = route.meta.resource ? route.meta.resource : null;
    }

    // check if session has expired - if so, use Refresh token. Otherwise logout
    // console.log(isUserLoggedIn());
    if (
      (!isUserLoggedIn() && route.meta === undefined)
      || (!isUserLoggedIn() && route.meta && !route.meta.authRoute && !route.meta.publicRoute)
    ) {
      /**
       ** If user is not Logged in & route meta is undefined
       ** OR
       ** If user is not Logged in & route.meta.authRoute, !route.meta.publicRoute are undefined
       ** Then redirect user to login
       */
      return <Redirect to="/login" />;
    } if (route.meta && route.meta.authRoute && isUserLoggedIn()) {
      // ** If route has meta and authRole and user is Logged in then redirect user to home page (DefaultRoute)
      return <Redirect to="/" />;
    } if (isUserLoggedIn() && !route.meta.publicRoute && !ability.can(action || 'read', resource)) {
      // ** If user is Logged in and doesn't have ability to visit the page redirect the user to Not Authorized
      return <Redirect to="/misc/not-authorized" />;
    }

    // ** get data from DB and set to state
    if (isUserLoggedIn()) {
      const dispatch = useDispatch();
      const store = useSelector((state) => state);

      // const store = useSelector((state) => state);
      // console.log('im Home');
      // const loggedUser = getUserData();

      // ** Get data on mount
      useEffect(() => {
        dispatch(getMe());
        // console.log('Redux Store: ', store);
        // console.log('Local Storage: ', getUserData());
        // const fields = ['title', 'firstName', 'lastName', 'email', 'role'];
        // fields.forEach((field) => setValue(field, user[field]));
        // setUser(user);
      }, [dispatch]);

      // dispatch(getMe());
    }

    // ** If none of the above render component
    return <route.component {...props} />;
  };

  // ** Return Route to Render
  const ResolveRoutes = () => Object.keys(Layouts).map((layout, index) => {
    // ** Convert Layout parameter to Layout Component
    // ? Note: make sure to keep layout and component name equal

    const LayoutTag = Layouts[layout];

    // ** Get Routes and Paths of the Layout
    const { LayoutRoutes, LayoutPaths } = LayoutRoutesAndPaths(layout);

    // ** We have freedom to display different layout for different route
    // ** We have made LayoutTag dynamic based on layout, we can also replace it with the only layout component,
    // ** that we want to implement like VerticalLayout or HorizontalLayout
    // ** We segregated all the routes based on the layouts and Resolved all those routes inside layouts

    // ** RouterProps to pass them to Layouts
    const routerProps = {};

    return (
      <Route path={LayoutPaths} key={index}>
        <LayoutTag
          routerProps={routerProps}
          layout={layout}
          setLayout={setLayout}
          transition={transition}
          setTransition={setTransition}
          currentActiveItem={currentActiveItem}
        >
          <Switch>
            {LayoutRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                exact={route.exact === true}
                render={(props) => {
                  // ** Assign props to routerProps
                  Object.assign(routerProps, {
                    ...props,
                    meta: route.meta,
                  });

                  return (
                    <Suspense fallback={null}>
                      {/* Layout Wrapper to add classes based on route's layout, appLayout and className */}
                      <LayoutWrapper
                        layout={DefaultLayout}
                        transition={transition}
                        setTransition={setTransition}
                        /* Conditional props */
                        /*eslint-disable */
                        {...(route.appLayout ? { appLayout: route.appLayout } : {})}
                        {...(route.meta ? { routeMeta: route.meta } : {})}
                        {...(route.className ? { wrapperClass: route.className } : {})}
                      >
                        <FinalRoute route={route} {...props} />
                      </LayoutWrapper>
                    </Suspense>
                  );
                }}
              />
            ))}
          </Switch>
        </LayoutTag>
      </Route>
    );
  });

  let idleTimer = null
  const onIdle = () => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    const role = userData.role
    if (role === 'admin') {
      dispatch(handleLogout())
      window.location.href = '/admin/login'
    }
    else {
      dispatch(handleLogout())
      window.location.href = '/login'
    }

  }
  // const handleOnIdle = event => {
  //   console.log('handleOnIdle')
  //   console.log('event: ', event)
  //   dispatch(handleLogout())
  //   return <Redirect to="/" />;

  // }
  // const { getRemainingTime, getLastActiveTime } = useIdleTimer({
  //   timeout: 1000 * 60 * 0.1,
  //   onIdle: handleOnIdle,
  //   debounce: 500
  // })
  return (
    <AppRouter basename={process.env.REACT_APP_BASENAME}>
      <IdleTimer
        ref={ref => { idleTimer = ref }}
        element={document}
        onIdle={onIdle}
        debounce={250}
        timeout={1000 * 60 * 60} />
      <Switch>
        {/* If user is logged in Redirect user to DefaultRoute else to login */}
        <Route
          exact
          path="/"
          render={() => (isUserLoggedIn() ? <Redirect to={DefaultRoute} /> : <Layouts.PageLayout><LandPage /></Layouts.PageLayout>)}
        />
        {/* Not Auth Route */}
        <Route
          exact
          path="/for-schools"
          render={(props) => (
            <Layouts.PageLayout>
              <SchoolPage />
            </Layouts.PageLayout>
          )}
        />
        <Route
          exact
          path="/parents-care"
          render={(props) => (
            <Layouts.PageLayout>
              <ParentPage />
            </Layouts.PageLayout>
          )}
        />
        <Route
          exact
          path="/for-stores"
          render={(props) => (
            <Layouts.PageLayout>
              <StorePage />
            </Layouts.PageLayout>
          )}
        />
        <Route
          exact
          path="/misc/not-authorized"
          render={(props) => (
            <Layouts.BlankLayout>
              <NotAuthorized />
            </Layouts.BlankLayout>
          )}
        />
        <Route
          exact
          path="/misc/not-connected"
          render={(props) => (
            <Layouts.BlankLayout>
              <NotConnected />
            </Layouts.BlankLayout>
          )}
        />
        <Route
          exact
          path="/misc/server-deploy"
          render={(props) => (
            <Layouts.BlankLayout>
              <Error503 />
            </Layouts.BlankLayout>
          )}
        />
        {ResolveRoutes()}

        {/* NotFound Error page */}
        <Route path="*" component={Error} />
      </Switch>
    </AppRouter>
  );
};

export default Router;
