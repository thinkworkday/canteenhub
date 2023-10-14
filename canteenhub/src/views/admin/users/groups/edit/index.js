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
import CardGroupSuppliers from '@src/components/cards/CardGroupSuppliers';
import AccountForm from './Account';

// import UserInfoCard from './UserInfoCard';
// import UserTimeline from './UserTimeline';
// import InvoiceList from '../../invoice/list';
// import PermissionsTable from './PermissionsTable';

// ** Styles
import '@styles/react/apps/app-users.scss';

const UserView = (props) => {
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
          Edit Group
        </h3>
      </div>

      <Row>
        <Col xl="8">
          <AccountForm selectedUser={store.selectedUser} />
        </Col>
        <Col>
          <CardGroupSuppliers groupId={id} />
        </Col>
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
