/* eslint-disable jsx-a11y/anchor-is-valid */
// ** React Imports
import { Fragment, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';

// ** Third Party Components
// import Select from 'react-select';
// import ReactPaginate from 'react-paginate';
import {
  ChevronDown, Plus, Search,
} from 'react-feather';
import DataTable from 'react-data-table-component';

import {
  Card, CardBody, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Label,
} from 'reactstrap';

import paginationRowsPerPageOptions from '@src/models/constants/paginationRowsPerPageOptions';
import { getProfiles, getProfile } from '@store/actions/customer.actions';
import { columns } from './columns';

// ** Custom Components
import AddProfileSidebar from '../AddProfileSidebar';

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss';
import '@styles/react/libs/tables/react-dataTable-component.scss';

const UsersList = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.profiles);
  const selectedProfile = useSelector((state) => state.profiles.selectedProfile);
  const { search } = useLocation();

  // console.log(store);

  // ** States
  const [formModal, setFormModal] = useState(false);
  const [addSidebarOpen, setAddSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(store.params?.q ? store.params.q : '');
  const [currentPage, setCurrentPage] = useState(store.params?.currentPage ? store.params.currentPage : 1);
  const [rowsPerPage, setRowsPerPage] = useState(store.params?.rowsPerPage ? store.params.rowsPerPage : 15);

  // ** AddEventSidebar Toggle Function
  const handleAddProfileSidebar = () => setAddSidebarOpen(!addSidebarOpen);

  // Set dispatch construct
  const dispatchParams = {
    currentPage,
    rowsPerPage,
    q: searchTerm,
  };

  // ** Get data on mount
  useEffect(() => {
    dispatch(getProfiles(dispatchParams));
  }, [dispatch, store.data?.length]);

  // ** Function in get data on search query change
  const handleFilter = (q) => {
    setSearchTerm(q);
    dispatch(
      getProfiles({
        ...dispatchParams,
        q,
      })
    );
  };

  // ** Function to persist
  const handlePaginationChange = (currentPage) => {
    setCurrentPage(currentPage);
    dispatch(
      getProfiles({
        ...dispatchParams,
        currentPage,
      })
    );
  };

  const handleRowPerPageChange = (rowsPerPage, currentPage) => {
    setRowsPerPage(rowsPerPage);
    setCurrentPage(currentPage);
    dispatch(
      getProfiles({
        ...dispatchParams,
        rowsPerPage,
        currentPage,
      })
    );
  };

  const handleInitEdit = async (row) => {
    await dispatch(getProfile(row._id));
    handleAddProfileSidebar();
  };

  return (
    <>
      <Row className="table-header">
        <Col>
          <h3>Profiles</h3>
          <small>Setup profiles for each of your children and assign to Schools and Classrooms</small>
        </Col>
        <Col
          xl="4"
          className="text-right"
        >
          <Button.Ripple size="sm" color="primary" onClick={() => handleAddProfileSidebar()}>
            <Plus size={14} />
            Add Profile
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
          columns={columns(handleAddProfileSidebar, handleInitEdit)}
          sortIcon={<ChevronDown />}
          paginationDefaultPage={currentPage}
          onChangePage={(page) => { handlePaginationChange(page); }}
          onChangeRowsPerPage={(currentRowsPerPage, currentPage) => { handleRowPerPageChange(currentRowsPerPage, currentPage); }}
        />
      </Card>

      <AddProfileSidebar
        store={store}
        selectedProfile={selectedProfile}
        dispatch={dispatch}
        // addEvent={addEvent}
        open={addSidebarOpen}
        // selectEvent={selectEvent}
        // updateEvent={updateEvent}
        // removeEvent={removeEvent}
        // calendarApi={calendarApi}
        // refetchEvents={refetchEvents}
        // calendarsColor={calendarsColor}
        handleAddProfileSidebar={handleAddProfileSidebar}
      />

    </>
  );
};

export default UsersList;
