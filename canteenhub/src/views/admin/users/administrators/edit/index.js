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

import { getAdmin } from '@store/actions/user.actions';

// ** User View Components
import AccountForm from './Account';

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
    dispatch(getAdmin(id));

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
          Edit Administrator
        </h3>
      </div>

      <Row>
        <Col>
          <AccountForm selectedUser={store.selectedUser} />
        </Col>
      </Row>
    </div>
  ) : (
    <Alert color="danger">
      <h4 className="alert-heading">Administrator not found</h4>
      <div className="alert-body">
        {`Administrator with id: ${id} does not exist `}
        <Link to="/user/list">Back</Link>
      </div>
    </Alert>
  );
};
export default UserView;
