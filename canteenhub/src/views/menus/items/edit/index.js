/* eslint-disable radix */
// ** React Imports
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux';

// ** Reactstrap
import {
  Button, Row, Col, Alert,
} from 'reactstrap';

import { getMenuItem } from '@store/actions/menu.actions';

// ** User View Components
import AccountForm from './Account';

// ** Styles
import '@styles/react/apps/app-users.scss';

const EditView = () => {
  // ** Vars
  const selectedRecord = useSelector((state) => state.records.selectedRecord);
  const dispatch = useDispatch();
  const { id } = useParams();

  // ** Get data on mount
  useEffect(() => {
    dispatch(getMenuItem(id));
    return () => dispatch(getMenuItem(''));
  }, [dispatch, id]);

  return selectedRecord !== null && selectedRecord !== undefined ? (
    <div className="app-user-view">
      <div className="table-header">
        <Button.Ripple color="flat-light" onClick={() => window.history.back()}>
          &lt; back to list
        </Button.Ripple>
        <h3>
          Edit Menu Item
        </h3>
      </div>

      <Row>
        <Col>
          <AccountForm selectedRecord={selectedRecord} />
        </Col>
      </Row>
    </div>
  ) : (
    <Alert color="danger">
      <div className="alert-body">
        {`Menu Item with id: ${id} does not exist. Please try again`}
      </div>
    </Alert>
  );
};
export default EditView;
