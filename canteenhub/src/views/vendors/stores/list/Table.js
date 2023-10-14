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
  Card, CardBody, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Col, Button,
} from 'reactstrap';

import paginationRowsPerPageOptions from '@src/models/constants/paginationRowsPerPageOptions';
import { getStores } from '@store/actions/vendor.actions';
import { getLoggedUser } from '@utils';
import { columns } from './columns';

// ** Custom Components

// ** utils

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss';
import '@styles/react/libs/tables/react-dataTable-component.scss';

const UsersList = () => {
  const loggedUser = getLoggedUser();

  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.stores);
  const { search } = useLocation();

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

  useEffect(() => {
    // dispatch(updateToken(search));
  }, [dispatch, search]);

  // ** Get data on mount
  useEffect(() => {
    dispatch(getStores(dispatchParams));
  }, [dispatch, store.data.length]);

  // ** Function in get data on search query change
  const handleFilter = (q) => {
    setSearchTerm(q);
    dispatch(
      getStores({
        ...dispatchParams,
        q,
      })
    );
  };

  // ** Function to persist
  const handlePaginationChange = (currentPage) => {
    setCurrentPage(currentPage);
    dispatch(
      getStores({
        ...dispatchParams,
        currentPage,
      })
    );
  };

  const handleRowPerPageChange = (rowsPerPage, currentPage) => {
    setRowsPerPage(rowsPerPage);
    setCurrentPage(currentPage);
    dispatch(
      getStores({
        ...dispatchParams,
        rowsPerPage,
        currentPage,
      })
    );
  };

  return (
    <>
      <Row className="table-header">
        <Col>
          <h3>Stores</h3>
          <small>These are the physical stores you use to prepare and dispatch lunches.</small>
        </Col>
        <Col
          xl="4"
          className="text-right"
        >
          {loggedUser.role !== 'store' ? (
            <Button.Ripple
              size="sm"
              color="primary"
              tag={Link}
              to="/vendor/store/add/"
            >
              <Plus size={14} />
              <span className="align-middle "> Add Store</span>
            </Button.Ripple>
          ) : <></>}
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
          columns={columns()}
          sortIcon={<ChevronDown />}
          paginationDefaultPage={currentPage}
          onChangePage={(page) => { handlePaginationChange(page); }}
          onChangeRowsPerPage={(currentRowsPerPage, currentPage) => { handleRowPerPageChange(currentRowsPerPage, currentPage); }}
        />
      </Card>

    </>
  );
};

export default UsersList;
