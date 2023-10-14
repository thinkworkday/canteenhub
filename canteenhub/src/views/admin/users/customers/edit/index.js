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

import { getUser } from '@store/actions/user.actions';

// ** User View Components
import AccountForm from './Account';
// import UserInfoCard from './UserInfoCard';

// ** Styles
import '@styles/react/apps/app-users.scss';

const UserView = () => {
  // ** Vars
  const store = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const { id } = useParams();
  // const [user, setUser] = useState({});

  // console.log(id);

  // ** Get data on mount
  useEffect(() => {
    dispatch(getUser(id));

    // console.log(store);

    // const fields = ['title', 'firstName', 'lastName', 'email', 'role'];
    // fields.forEach((field) => setValue(field, user[field]));
    // setUser(user);
  }, [dispatch]);

  return store.selectedUser !== null && store.selectedUser !== undefined ? (
    <div className="app-user-view">
      <div className="table-header">
        <Button.Ripple color="flat-light" onClick={() => window.history.back()}>
          &lt; back to list
        </Button.Ripple>
        <h3>
          Edit Customer
        </h3>
      </div>

      <Row>
        <Col>
          <AccountForm selectedUser={store.selectedUser} />
        </Col>
        {/* <Col xl="3" lg="4" md="5">
          <PlanCard selectedUser={store.selectedUser} />
        </Col> */}
      </Row>
    </div>
  ) : (
    <Alert color="danger">
      <h4 className="alert-heading">User not found</h4>
      <div className="alert-body">
        {`User with id: ${id} does not exist `}
        <Link to="/user/list">Back to Users List</Link>
      </div>
    </Alert>
  );
};
export default UserView;
