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

import { getSubgroup } from '@store/actions/group.actions';

// ** User View Components
import InviteForm from './Invite';

// ** Styles
import '@styles/react/apps/app-users.scss';

const StoreView = (props) => {
  const selectedRecord = useSelector((state) => state.records.selectedRecord);
  const dispatch = useDispatch();
  const { id } = useParams();

  // ** Get data on mount
  useEffect(() => {
    dispatch(getSubgroup(id));
  }, [dispatch]);

  return (selectedRecord !== null && selectedRecord !== undefined) ? (
    <div className="app-user-view">
      <div className="table-header">
        <Button.Ripple color="flat-light" onClick={() => window.history.back()}>
          &lt; back to list
        </Button.Ripple>
        <h3>
          Invite Customers
        </h3>
      </div>

      <Row>
        <Col>
          <InviteForm selectedRecord={selectedRecord} />
        </Col>
        {/* <Col xl="3" lg="4" md="5">
          <PlanCard selectedUser={store.selectedUser} />
        </Col> */}
      </Row>
    </div>
  ) : (
    <Alert color="danger">
      <h4 className="alert-heading">Classroom not found</h4>
      <div className="alert-body">
        {`Subgroup with id: ${id} does not exist `}
        <Link to="/stores">Back to List</Link>
      </div>
    </Alert>
  );
};
export default StoreView;
