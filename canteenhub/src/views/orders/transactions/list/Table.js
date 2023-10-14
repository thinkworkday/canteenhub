/* eslint-disable jsx-a11y/anchor-is-valid */
// ** React Imports
import { Fragment, useState, useEffect } from 'react';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';

// ** Third Party Components
import {
  ChevronDown, Filter,
} from 'react-feather';
import DataTable from 'react-data-table-component';

import {
  Card, CardBody, Row, Col, Button,
} from 'reactstrap';

import paginationRowsPerPageOptions from '@src/models/constants/paginationRowsPerPageOptions';
import { getCustomerTransactions } from '@store/actions/payment.actions';

import classnames from 'classnames';
// import moment from 'moment';
// import { priceFormatter } from '@utils';
import { columns } from './columns';

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss';
import '@styles/react/libs/tables/react-dataTable-component.scss';

// ** Custom Components
import FilterSidebar from './FilterSidebar';

// ** Constants
const OrdersList = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions);

  // ** States
  const [searchTerm, setSearchTerm] = useState(transactions.params?.q ? transactions.params.q : '');
  const [currentPage, setCurrentPage] = useState(transactions.params?.currentPage ? transactions.params.currentPage : 1);
  const [rowsPerPage, setRowsPerPage] = useState(transactions.params?.rowsPerPage ? transactions.params.rowsPerPage : 15);
  const [dispatchParams, setDispatchParams] = useState({
    currentPage,
    rowsPerPage,
    q: searchTerm,
  });

  const [filterCount, setFilterCount] = useState({});

  // ** Filter sidebar
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const handleFilterSidebar = () => setFilterSidebarOpen(!filterSidebarOpen);

  // ** Get data on mount
  useEffect(() => {
    dispatch(getCustomerTransactions(dispatchParams));
  }, [dispatch]);

  // ** Set the filter count
  useEffect(() => {
    setFilterCount(Object.keys(dispatchParams).reduce((accumulator, filter) => (filter === 'dateRange' || filter === 'orderNumber' ? accumulator + 1 : accumulator), 0));
  }, [dispatchParams]);

  const handleFilterClick = () => {
    handleFilterSidebar();
  };

  // ** Function to persist
  const handlePaginationChange = (currentPage) => {
    setCurrentPage(currentPage);
    dispatch(
      getCustomerTransactions({
        ...dispatchParams,
        currentPage,
      })
    );
  };

  const handleRowPerPageChange = (rowsPerPage, currentPage) => {
    setRowsPerPage(rowsPerPage);
    setCurrentPage(currentPage);
    dispatch(
      getCustomerTransactions({
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
          <h3>Transactions</h3>
          <small>Order transactions made with payment gateway. Note: one order transaction can include multiple orders</small>
        </Col>
        <Col
          xl="4"
          className="text-right"
        />
      </Row>

      <Card>
        {/* <CardBody>
          <Row className="justify-content-end">
            <Col
              xl="6"
              className="d-flex align-items-center justify-content-end"
            >

              <Button.Ripple
                size="sm"
                color="primary"
                outline
                className={classnames({
                  'ml-1': true,
                  active: filterCount > 0,
                })}
                onClick={handleFilterClick}
              >
                <Filter size={14} />
                <span className="align-middle ">
                  {' '}
                  Filter
                </span>
              </Button.Ripple>
            </Col>
          </Row>
        </CardBody> */}

        <DataTable
          data={transactions.data}
          responsive
          className="react-dataTable"
          noHeader
          pagination
          // paginationServer
          // paginationTotalRows={transactions.filteredCount}
          paginationPerPage={rowsPerPage}
          paginationRowsPerPageOptions={paginationRowsPerPageOptions}
          columns={columns()}
          sortIcon={<ChevronDown />}
          paginationDefaultPage={currentPage}
          onChangePage={(page) => { handlePaginationChange(page); }}
          onChangeRowsPerPage={(currentRowsPerPage, currentPage) => { handleRowPerPageChange(currentRowsPerPage, currentPage); }}
        />
      </Card>

      {/* <FilterSidebar
        open={filterSidebarOpen}
        dispatchParams={dispatchParams}
        setDispatchParams={setDispatchParams}
        handleFilterSidebar={handleFilterSidebar}
      /> */}

    </>
  );
};

export default OrdersList;
