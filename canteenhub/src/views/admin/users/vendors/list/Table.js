/* eslint-disable jsx-a11y/anchor-is-valid */
// ** React Imports
import { Fragment, useState, useEffect } from 'react';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';

// ** Third Party Components
import Select from 'react-select';
// import ReactPaginate from 'react-paginate';
import {
  ChevronDown, Search,
} from 'react-feather';
import DataTable from 'react-data-table-component';

import {
  Card, CardBody, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Col, Button,
} from 'reactstrap';

import paginationRowsPerPageOptions from '@src/models/constants/paginationRowsPerPageOptions';
import { getUsers } from '@store/actions/user.actions';
import statusOptions from '@src/models/constants/userStatus';
import { columns } from './columns';
// import Sidebar from './Sidebar';

// Handlers

// ** Custom Components

// constants

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss';
import '@styles/react/libs/tables/react-dataTable-component.scss';

const UsersList = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.users);

  const urlParams = new URLSearchParams(window.location.search);
  const urlStatus = statusOptions.find(({ value }) => value === urlParams.get('status'));
  // console.log(store.params.status);

  // const result = statusOptions.find(({ value }) => value === 'active');
  // console.log('result: ', result);

  // ** States
  const [searchTerm, setSearchTerm] = useState(store.params && store.params.q ? store.params.q : '');
  const [currentPage, setCurrentPage] = useState(store.params && store.params.currentPage ? store.params.currentPage : 1);
  const [rowsPerPage, setRowsPerPage] = useState(store.params && store.params.rowsPerPage ? store.params.rowsPerPage : 15);
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentRole] = useState('vendor');
  const [currentStatus, setCurrentStatus] = useState(store.params && store.params.status ? statusOptions.find(({ value }) => value === store.params.status) : { value: '', label: 'Status...' });

  // ** Function to toggle sidebar
  // const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Set dispatch construct
  const dispatchParams = {
    currentPage,
    rowsPerPage,
    role: currentRole,
    q: searchTerm,
    status: currentStatus.value,
  };

  // ** Get data on mount
  useEffect(() => {
    if (urlStatus) {
      setCurrentStatus(urlStatus);
    }

    dispatch(getUsers(dispatchParams));
  }, [dispatch, store.data.length, urlStatus]);

  // ** Function in get                    data on search query change
  const handleFilter = (q) => {
    setSearchTerm(q);
    dispatch(
      getUsers({
        ...dispatchParams,
        q,
      })
    );
  };

  // ** Function to persist
  const handlePaginationChange = (currentPage) => {
    setCurrentPage(currentPage);
    dispatch(
      getUsers({
        ...dispatchParams,
        currentPage,
      })
    );
  };

  const handleRowPerPageChange = (rowsPerPage, currentPage) => {
    setRowsPerPage(rowsPerPage);
    setCurrentPage(currentPage);
    dispatch(
      getUsers({
        ...dispatchParams,
        rowsPerPage,
        currentPage,
      })
    );
  };

  const handleStatusChange = (data) => {
    setCurrentStatus(data || { value: '', label: 'Status...' });
    dispatch(
      getUsers({
        ...dispatchParams,
        status: data ? data.value : '',
      })
    );
  };

  return (
    <>
      <div className="table-header">
        {/* <small>List</small> */}
        <h3>Vendors</h3>
        {urlStatus?.value ? (
          <small className="text-primary">
            Displaying
            {' '}
            {urlStatus.value}
            {' '}
            vendors only
          </small>
        ) : ''}
      </div>

      <Card>

        <CardBody>
          <Row className="justify-content-between">

            <Col
              md="4"
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

            <Col
              md="3"
            >
              <Select
                isClearable
                placeholder="Status..."
                className="react-select"
                classNamePrefix="select"
                options={statusOptions}
                value={currentStatus}
                onChange={(data) => { handleStatusChange(data); }}
              />
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
          columns={columns}
          sortIcon={<ChevronDown />}
          paginationDefaultPage={currentPage}
          onChangePage={(page) => { handlePaginationChange(page); }}
          onChangeRowsPerPage={(currentRowsPerPage, currentPage) => { handleRowPerPageChange(currentRowsPerPage, currentPage); }}
        />
      </Card>

      {/* <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} /> */}
    </>
  );
};

export default UsersList;
