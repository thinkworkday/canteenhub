// ** Routes Imports
import { getHomeRouteForLoggedInUser, getUserData } from '@utils';
import AuthRoutes from './Auth';
import AdminRoutes from './Administrators';
// import PagesRoutes from './Pages';
import DashboardRoutes from './Dashboards';
import UserRoutes from './Users';
import MenuRoutes from './Menus';
import VendorsRoutes from './Vendors';
import StoresRoutes from './Stores';
import GroupRoutes from './Groups';
import CustomerRoutes from './Customers';
import OrderRoutes from './Orders';
import PagesRoutes from './Pages';
import ReportsRoutes from './Reports';
import TransactionRoutes from './Transactions';
import MarketRoutes from './Market';
import NewsLettertRoutes from './NewsLetter';

// ** Document title
const TemplateTitle = '%s - Canteen Hub';

// ** Default Route
const loggedUser = getUserData();
const DefaultRoute = loggedUser ? getHomeRouteForLoggedInUser(loggedUser.role) : getHomeRouteForLoggedInUser();

// ** Merge Routes
const Routes = [
  ...AuthRoutes,
  ...AdminRoutes,
  ...DashboardRoutes,
  ...MenuRoutes,
  ...UserRoutes,
  ...VendorsRoutes,
  ...StoresRoutes,
  ...GroupRoutes,
  ...CustomerRoutes,
  ...OrderRoutes,
  ...PagesRoutes,
  ...ReportsRoutes,
  ...TransactionRoutes,
  ...MarketRoutes,
  ...NewsLettertRoutes,
];

export { DefaultRoute, TemplateTitle, Routes };
