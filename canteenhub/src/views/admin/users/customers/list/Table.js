/* eslint-disable jsx-a11y/anchor-is-valid */
// ** React Imports
import { Fragment, useState, useEffect } from 'react';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';

// ** Third Party Components
// import Select from 'react-select';
// import ReactPaginate from 'react-paginate';
import {
  ChevronDown, Search, Download,
} from 'react-feather';
import DataTable from 'react-data-table-component';

import { CSVLink } from 'react-csv';
import moment from 'moment';

import {
  Card, CardBody, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Col, Button,
} from 'reactstrap';

import paginationRowsPerPageOptions from '@src/models/constants/paginationRowsPerPageOptions';
import { getCustomers } from '@store/actions/user.actions';
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

  // console.log(store.params);

  // ** States
  const [searchTerm, setSearchTerm] = useState(store.params.q ? store.params.q : '');
  const [currentPage, setCurrentPage] = useState(store.params.currentPage ? store.params.currentPage : 1);
  const [rowsPerPage, setRowsPerPage] = useState(store.params.rowsPerPage ? store.params.rowsPerPage : 15);
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentRole] = useState('customer');

  const [csvData, setCsvData] = useState();

  // ** Function to toggle sidebar
  // const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Set dispatch construct
  const dispatchParams = {
    currentPage,
    rowsPerPage,
    role: currentRole,
    q: searchTerm,
  };

  // ** Get data on mount
  useEffect(() => {
    dispatch(getCustomers(dispatchParams));
  }, [dispatch, currentPage, rowsPerPage]);

  useEffect(() => {
    let csvDataObj = [];

    // Configure CSV data
    if (store.data.length > 0) {
      csvDataObj = store.data.map((row) => {
        let csvProfileData = [];
        if (row.profiles) {
          csvProfileData = row.profiles.map((profile, i) => {
            const returnArray = {};
            returnArray[`Profile ${i + 1} First Name`] = profile.firstName ? profile.firstName : '';
            returnArray[`Profile ${i + 1} Last Name`] = profile.lastName ? profile.lastName : '';
            returnArray[`Profile ${i + 1} Group`] = profile.group.length > 0 ? profile.group[0].companyName : '';
            returnArray[`Profile ${i + 1} Subgroup`] = profile.subgroup && profile.subgroup.length > 0 ? profile.subgroup[0].name : '';
            return (returnArray);
          });
        }
        if (csvProfileData.length > 0) {
          csvProfileData = csvProfileData.reduce(((r, c) => Object.assign(r, c)), {});
        }

        return ({
          'Email Address': row.email,
          'First Name': row.firstName,
          'Last Name': row.lastName,
          ...csvProfileData,
        });
      });
      setCsvData(csvDataObj);
    }
  }, [store.data]);

  // ** Function in get data on search query change
  const handleFilter = (q) => {
    setSearchTerm(q);
    dispatch(
      getCustomers({
        ...dispatchParams,
        q,
      })
    );
  };

  // ** Function to persist
  const handlePaginationChange = (currentPage) => {
    setCurrentPage(currentPage);
    // dispatch(
    //   getCustomers({
    //     ...dispatchParams,
    //     currentPage,
    //   })
    // );
  };

  const handleRowPerPageChange = (rowsPerPage, currentPage) => {
    setRowsPerPage(rowsPerPage);
    setCurrentPage(currentPage);
    // dispatch(
    //   getCustomers({
    //     ...dispatchParams,
    //     rowsPerPage,
    //     currentPage,
    //   })
    // );
  };

  return (
    <>
      <Row>
        <Col><h3>Customers</h3></Col>
        <Col className=" text-right">
          <CSVLink className="waves-effect btn btn-outline-primary btn-sm ml-auto" data={csvData || ''} filename={`customers-${moment().format('YYYYMMDDHHmmss')}.csv`}>
            <Download size={14} />
            {' '}
            CSV Export All
          </CSVLink>
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
          paginationServer
          paginationTotalRows={store.filteredCount}
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
