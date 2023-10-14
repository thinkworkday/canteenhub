/* eslint-disable radix */
// ** React Imports
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux';

// ** Custom Components
import Avatar from '@components/avatar';

// ** Reactstrap
import {
  Button, Row, Col, Alert,
} from 'reactstrap';

import { getMe } from '@store/actions/user.actions';

// ** User View Components
import AccountForm from './Account';

// ** Styles
import '@styles/react/apps/app-users.scss';

const StoreView = (props) => {
  const dispatch = useDispatch();
  const me = useSelector((state) => state.auth.userData);

  //* * Vars
  const userAvatar = (me && me.avatar) || null;
  const userName = (me && me.firstName) ? `${me.firstName} ${me.lastName}` : 'John Doe';

  const UserAvatar = (props) => {
    const { userAvatar, userName } = props;
    return (userAvatar) ? <Avatar img={userAvatar} status="" /> : <Avatar color="secondary" content={userName} initials status="" />;
  };

  // ** Get data on mount
  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  return (me !== null && me !== undefined) ? (
    <div className="app-user-view">
      <div className="table-header">

        <div className="d-flex align-items-center">

          <h3 className="">
            Manage your profile
          </h3>
        </div>

      </div>

      <Row>
        <Col>
          <AccountForm selectedRecord={me} />
        </Col>
      </Row>
    </div>
  ) : (
    <Alert color="danger">
      <div className="alert-body">
        Oooops something is wrong
      </div>
    </Alert>
  );
};
export default StoreView;
