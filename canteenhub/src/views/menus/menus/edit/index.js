/* eslint-disable radix */
// ** React Imports
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux';
import { getLoggedUser } from '@utils';

// ** Reactstrap
import {
  Button, Row, Col, Alert,
} from 'reactstrap';

import { getMenu } from '@store/actions/menu.actions';

// ** User View Components
import {
  Edit3,
} from 'react-feather';
import ModalEditMenuHeader from './ModalEditMenuHeader';
import MenuConfigForm from './MenuConfig';
import MenuConfigReadOnly from './MenuConfigReadOnly';

const StoreView = () => {
  const selectedMenu = useSelector((state) => state.menus.selectedMenu);
  const dispatch = useDispatch();
  const { id } = useParams();

  const loggedUser = getLoggedUser();

  const [canEdit, setCanEdit] = useState(false);
  const [modalEditHeaderVisibility, setModalEditHeaderVisibility] = useState(false);
  const [currency, setCurrency] = useState('');

  const toggleEditHeaderModal = () => {
    setModalEditHeaderVisibility(!modalEditHeaderVisibility);
  };

  // ** Get data on mount
  useEffect(() => {
    dispatch(getMenu(id, true));
  }, [dispatch]);

  useEffect(() => {
    if (selectedMenu) {
      setCanEdit(!!(loggedUser.role === 'admin' || ((loggedUser.role === 'vendor' || loggedUser.role === 'store') && (typeof selectedMenu.menuParent !== 'undefined'))));
    }
  }, [selectedMenu]);

  useEffect(() => {
    const getCurrency = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const currencyData = await response.json();
          setCurrency(currencyData.currency === 'AUD' || currencyData.currency === 'NZD' ? currencyData.currency : 'AUD');
        } else {
          throw new Error('Request failed');
        }
      } catch (error) {
        console.log(error);
      }
    };

    getCurrency();
  }, []);

  return (selectedMenu !== null && selectedMenu !== undefined) ? (
    <div className="app-user-view">
      <div className="table-header">
        <Button.Ripple
          color="flat-light"
          tag={Link}
          to={`/${loggedUser.role}/menus/list`}
        >
          &lt; back
        </Button.Ripple>

        <div className="d-flex w-auto align-items-center trigger-inline-edit">
          <div>
            <h3 className="mb-0">
              {selectedMenu.name}
            </h3>
            <p>{selectedMenu.description}</p>
          </div>
          {canEdit ? <Edit3 size={14} className="cursor-pointer action-btn ml-2" onClick={() => toggleEditHeaderModal()} /> : ''}
        </div>
        {canEdit ? <ModalEditMenuHeader modalVisibility={modalEditHeaderVisibility} modalToggle={() => toggleEditHeaderModal()} selectedRecord={selectedMenu} /> : ''}
      </div>
      <Row>
        <Col>
          {canEdit ? <MenuConfigForm currentCurrency={currency} /> : <MenuConfigReadOnly currentCurrency={currency} />}
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
