/* eslint-disable jsx-a11y/anchor-is-valid */
// ** React Imports
import { Fragment, useState, useEffect } from 'react';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';

// ** Third Party Components
// import Select from 'react-select';
// import ReactPaginate from 'react-paginate';
import {
  ChevronDown, Plus, Search, GitCommit,
} from 'react-feather';
import DataTable from 'react-data-table-component';

import {
  Card, CardBody, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Col, Button,
} from 'reactstrap';

import paginationRowsPerPageOptions from '@src/models/constants/paginationRowsPerPageOptions';
import { getInvites } from '@store/actions/invite.actions';
import { getGroups } from '@store/actions/group.actions';
import CardInviteList from '@src/components/CardInviteList';
import { columns } from './columns';
import Sidebar from './Sidebar';

// constants

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss';
import '@styles/react/libs/tables/react-dataTable-component.scss';

const UsersList = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.users);
  const groups = useSelector((state) => state.groups);
  const pendingInvites = useSelector((state) => state.invites);

  // ** States
  const [searchTerm, setSearchTerm] = useState(store.params.q ? store.params.q : '');

  const [currentPage, setCurrentPage] = useState(store.params.currentPage ? store.params.currentPage : 1);
  const [rowsPerPage, setRowsPerPage] = useState(store.params.rowsPerPage ? store.params.rowsPerPage : 15);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentRole] = useState('admin');

  // ** Function to toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Set dispatch construct
  const dispatchParams = {
    currentPage,
    rowsPerPage,
    role: currentRole,
    q: searchTerm,
  };

  // ** Get data on mount
  useEffect(() => {
    dispatch(getInvites('pending'));
    dispatch(getGroups(dispatchParams));
  }, [dispatch, store.data.length]);

  // ** Function in get data on search query change
  const handleFilter = (q) => {
    setSearchTerm(q);
    dispatch(
      getGroups({
        ...dispatchParams,
        q,
      })
    );
  };

  // ** Function to persist
  const handlePaginationChange = (currentPage) => {
    setCurrentPage(currentPage);
    dispatch(
      getGroups({
        ...dispatchParams,
        currentPage,
      })
    );
  };

  const handleRowPerPageChange = (rowsPerPage, currentPage) => {
    setRowsPerPage(rowsPerPage);
    setCurrentPage(currentPage);
    dispatch(
      getGroups({
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
          <h3>Schools</h3>
        </Col>
        <Col
          xl="4"
          className="text-right"
        >
          <Button.Ripple size="sm" color="primary" onClick={toggleSidebar}>
            <Plus size={14} />
            <span className="align-middle ">Invite School</span>
          </Button.Ripple>
        </Col>
      </Row>

      <Row>
        <Col
          lg="8"
          className="text-right"
        >
          {groups.data.length && groups.data.length > 0 ? (
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
                data={groups.data}
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
          ) : (
            <Card color="light-secondary">
              <CardBody className="text-center p-3">
                <GitCommit size="40px" />
                <h5>You currently are not connected to any schools</h5>
                <small>
                  You can invite schools - which will send an enquiry to the provided contact.
                  <br />
                  If the school approves, then you will see them appear in this list here.
                </small>
                <br />
                <Button.Ripple className="mt-2" size="sm" color="primary" onClick={toggleSidebar}>
                  <Plus size={14} />
                  <span className="align-middle ">Invite School</span>
                </Button.Ripple>
              </CardBody>
            </Card>
          ) }
        </Col>
        <Col
          lg="4"
        >
          <CardInviteList inviteData={pendingInvites} />
        </Col>
      </Row>
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};

export default UsersList;
