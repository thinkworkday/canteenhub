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
import { getMenuOptions } from '@store/actions/menu.actions';
import ModalCreateEditOption from '@src/components/modals/ModalCreateEditOption';
import ModalDeleteRecord from '@src/components/modals/ModalDeleteRecord';
import { columns } from './columns';

// ** Components

// constants

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss';
import '@styles/react/libs/tables/react-dataTable-component.scss';

const TableList = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.records);
  const [selectedRecord, setSelectedRecord] = useState({});

  const [modalAddOptionVisibility, setModalAddOptionVisibility] = useState(false);
  const toggleOptionModal = () => { setModalAddOptionVisibility(!modalAddOptionVisibility); };
  const toggleAddOptionModal = () => { setSelectedRecord(); setModalAddOptionVisibility(!modalAddOptionVisibility); };
  const toggleEditOptionModal = (row) => {
    setSelectedRecord(row);
    setModalAddOptionVisibility(!modalAddOptionVisibility);
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
    dispatch(getMenuOptions(dispatchParams));
  }, [dispatch, store.data.length]);

  // ** Function in get data on search query change
  const handleFilter = (q) => {
    setSearchTerm(q);
    dispatch(
      getMenuOptions({
        ...dispatchParams,
        q,
      })
    );
  };

  // ** Function to persist
  const handlePaginationChange = (currentPage) => {
    setCurrentPage(currentPage);
    dispatch(
      getMenuOptions({
        ...dispatchParams,
        currentPage,
      })
    );
  };

  const handleRowPerPageChange = (rowsPerPage, currentPage) => {
    setRowsPerPage(rowsPerPage);
    setCurrentPage(currentPage);
    dispatch(
      getMenuOptions({
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
          <h3>Menu Options</h3>
          <small>Note: only menu options created by you are visible</small>
        </Col>
        <Col
          xl="4"
          className="text-right"
        >
          <Button.Ripple
            size="sm"
            color="primary"
            onClick={() => toggleAddOptionModal()}
          >
            <Plus size={14} />
            <span className="align-middle "> Add Option Group</span>
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
          columns={columns(toggleEditOptionModal, toggleDeleteRecordModal)}
          sortIcon={<ChevronDown />}
          paginationDefaultPage={currentPage}
          onChangePage={(page) => { handlePaginationChange(page); }}
          onChangeRowsPerPage={(currentRowsPerPage, currentPage) => { handleRowPerPageChange(currentRowsPerPage, currentPage); }}
        />

        {/*  Modals */}
        <ModalCreateEditOption modalVisibility={modalAddOptionVisibility} modalToggle={() => toggleOptionModal()} selectedRecord={selectedRecord} />
        <ModalDeleteRecord modalVisibility={modalDeleteRecordVisibility} modalToggle={() => toggleDeleteRecordModal()} recordSource="MenuOption" recordId={deleteId} />

      </Card>

    </>
  );
};

export default TableList;
