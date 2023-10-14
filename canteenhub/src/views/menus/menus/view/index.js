/* eslint-disable radix */
// ** React Imports
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux';

// ** Reactstrap
import {
  Button, Row, Col, Alert,
} from 'reactstrap';

import { getMenu } from '@store/actions/menu.actions';

// ** User View Components
import {
  Edit3,
} from 'react-feather';
// import ModalEditMenuHeader from './ModalEditMenuHeader';
// import AccountForm from './Account';
import MenuConfigForm from './MenuConfig';

// ** Styles
import '@styles/react/apps/app-users.scss';

const StoreView = (props) => {
  const selectedMenu = useSelector((state) => state.menus.selectedMenu);
  const dispatch = useDispatch();
  const { id } = useParams();

  // const [modalEditHeaderVisibility, setModalEditHeaderVisibility] = useState(false);
  // const toggleEditHeaderModal = () => {
  //   setModalEditHeaderVisibility(!modalEditHeaderVisibility);
  // };

  // ** Get data on mount
  useEffect(() => {
    dispatch(getMenu(id, true));
  }, [dispatch]);

  return (selectedMenu !== null && selectedMenu !== undefined) ? (
    <div className="app-user-view">
      <div className="table-header">
        <Button.Ripple color="flat-light" onClick={() => window.history.back()}>
          &lt; back
        </Button.Ripple>

        <div className="d-flex w-auto align-items-center trigger-inline-edit">
          <div>
            <h3 className="mb-0">
              {selectedMenu.name}
            </h3>
            <p>{selectedMenu.description}</p>
          </div>
        </div>
      </div>
      <Row>
        <Col>
          {/* <AccountForm selectedRecord={selectedRecord} /> */}
          <MenuConfigForm />
        </Col>
      </Row>
    </div>
  ) : (
    <Alert color="danger">
      <div className="alert-body">
        {`Menu with id: ${id} does not exist `}
        <Link to="/stores">Back to List</Link>
      </div>
    </Alert>
  );
};
export default StoreView;
