/* eslint-disable radix */
// ** React Imports
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux';

// ** Reactstrap
import {
  Button, Row, Col, Alert,
} from 'reactstrap';

// ** User View Components
import AccountForm from './Account';
// import UserInfoCard from './UserInfoCard';
// import UserTimeline from './UserTimeline';
// import InvoiceList from '../../invoice/list';
// import PermissionsTable from './PermissionsTable';

// ** Styles
import '@styles/react/apps/app-users.scss';

const UserView = (props) => {
  // ** Vars
  // const store = useSelector((state) => state.users);
  // const dispatch = useDispatch();
  const { id } = useParams();
  // const [user, setUser] = useState({});

  // console.log(id);

  // ** Get data on mount
  // useEffect(() => {
  // dispatch(getUser(id));

  // console.log(store);

  // const fields = ['title', 'firstName', 'lastName', 'email', 'role'];
  // fields.forEach((field) => setValue(field, user[field]));
  // setUser(user);
  // }, [dispatch]);

  return (
    <div className="app-user-view">
      <div className="table-header">
        <Button.Ripple color="flat-light" onClick={() => window.history.back()}>
          &lt; back to list
        </Button.Ripple>
        <h3>
          Add Store
        </h3>
      </div>

      <Row>
        <Col>
          <AccountForm />
        </Col>
        {/* <Col xl="3" lg="4" md="5">
          <PlanCard selectedUser={store.selectedUser} />
        </Col> */}
      </Row>
    </div>

  );
};
export default UserView;
