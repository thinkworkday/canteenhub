/* eslint-disable jsx-a11y/anchor-is-valid */
// ** React Imports
import { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';

// ** Third Party Components
import {
  ChevronDown, Plus, Search,
} from 'react-feather';
import DataTable from 'react-data-table-component';

import {
  Card, CardBody, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Col, Button,
} from 'reactstrap';

import paginationRowsPerPageOptions from '@src/models/constants/paginationRowsPerPageOptions';
import { getMenuItems } from '@store/actions/menu.actions';
import ModalCreateMenuItem from '@src/components/modals/ModalCreateMenuItem';
import ModalDeleteRecord from '@src/components/modals/ModalDeleteRecord';
import { columns } from './columns';

// constants

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss';
import '@styles/react/libs/tables/react-dataTable-component.scss';

const TableList = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.records);

  const [modalCreateMenuItemVisibility, setModalCreateMenuItemVisibility] = useState(false);
  const toggleCreateMenuItemModal = () => {
    setModalCreateMenuItemVisibility(!modalCreateMenuItemVisibility);
  };

  // ** Delete Record Modal States
  const [modalDeleteRecordVisibility, setModalDeleteRecordVisibility] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const toggleDeleteRecordModal = (row) => {
    if (row) {
      setDeleteId(row._id);
    }
    setModalDeleteRecordVisibility(!modalDeleteRecordVisibility);
  };

  // ** States
  const [searchTerm, setSearchTerm] = useState(store.params?.q ? store.params.q : '');
  const [currentPage, setCurrentPage] = useState(store.params?.currentPage ? store.params.currentPage : 1);
  const [rowsPerPage, setRowsPerPage] = useState(store.params?.rowsPerPage ? store.params.rowsPerPage : 15);

  // Set dispatch construct
  const dispatchParams = {
    currentPage,
    rowsPerPage,
    q: searchTerm,
  };

  // ** Get data on mount
  useEffect(() => {
    dispatch(getMenuItems(dispatchParams));
  }, [dispatch, store.data.length]);

  // ** Function in get data on search query change
  const handleFilter = (q) => {
    setSearchTerm(q);
    dispatch(
      getMenuItems({
        ...dispatchParams,
        q,
      })
    );
  };

  // ** Function to persist
  const handlePaginationChange = (currentPage) => {
    setCurrentPage(currentPage);
    dispatch(
      getMenuItems({
        ...dispatchParams,
        currentPage,
      })
    );
  };

  const handleRowPerPageChange = (rowsPerPage, currentPage) => {
    setRowsPerPage(rowsPerPage);
    setCurrentPage(currentPage);
    dispatch(
      getMenuItems({
        ...dispatchParams,
        rowsPerPage,
        currentPage,
      })
    );
  };

  return (
    <>
      <Row className="table-header">
        {/* <small>List</small> */}

        <Col>
          <h3>Menu Items</h3>
          <small>Note: only menu items created by you are visible</small>
        </Col>
        <Col
          xl="4"
          className="text-right"
        >
          {/* <Button.Ripple
            size="sm"
            color="primary"
            tag={Link}
            to="/admin/menu-items/form/add"
            // to="/admin/menu-items/add"
          >
            <Plus size={14} />
            <span className="align-middle "> Add Menu Item</span>
          </Button.Ripple> */}

          <Button.Ripple
            size="sm"
            color="primary"
            onClick={() => toggleCreateMenuItemModal()}
          >
            <Plus size={14} />
            <span className="align-middle "> Create Menu Item</span>
          </Button.Ripple>

        </Col>
      </Row>

      <Card>

        <CardBody>
          <Row className="justify-content-end">
            <Col
              xl="4"
              className="d-flex align-items-center"
            >
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <Search size={14} />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  id="search-user"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleFilter(e.target.value ? e.target.value : '')}
                />
              </InputGroup>
              {searchTerm && (<Button.Ripple size="sm" className="clear-link d-block" onClick={() => { handleFilter(''); }} color="flat-light">clear</Button.Ripple>)}
            </Col>
          </Row>
        </CardBody>

        <DataTable
          data={store.data}
          responsive
          className="react-dataTable"
          noHeader
          pagination
          paginationPerPage={rowsPerPage}
          paginationRowsPerPageOptions={paginationRowsPerPageOptions}
          columns={columns(toggleDeleteRecordModal)}
          sortIcon={<ChevronDown />}
          paginationDefaultPage={currentPage}
          onChangePage={(page) => { handlePaginationChange(page); }}
          onChangeRowsPerPage={(currentRowsPerPage, currentPage) => { handleRowPerPageChange(currentRowsPerPage, currentPage); }}
        />
      </Card>

      <ModalCreateMenuItem modalVisibility={modalCreateMenuItemVisibility} modalToggle={() => toggleCreateMenuItemModal()} />
      <ModalDeleteRecord modalVisibility={modalDeleteRecordVisibility} modalToggle={() => toggleDeleteRecordModal()} recordSource="MenuItem" recordId={deleteId} />

    </>
  );
};

export default TableList;
