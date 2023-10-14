import { getHomeRouteForLoggedInUser, getUserData } from '@utils';

import { Suspense } from 'react';
import {
  Redirect,
} from 'react-router-dom';

import Spinner from '../components/FallbackSpinner';

const Home = () => {
  console.log('ddddddd');
  const loggedUser = getUserData();
  // console.log('getHomeRouteForLoggedInUser', getHomeRouteForLoggedInUser());
  const userDashboard = getHomeRouteForLoggedInUser(loggedUser.role);
  return (
    <Suspense fallback={<Spinner />}>
      <Redirect to={userDashboard} />
    </Suspense>
  );
};

export default Home;
