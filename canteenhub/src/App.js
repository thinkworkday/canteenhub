// ** Router Import
import Router from './router/Router';
import checkRequests from './hoc/CheckRequests';
// ** Router Components
const App = (props) => <Router />;

export default checkRequests(App);
