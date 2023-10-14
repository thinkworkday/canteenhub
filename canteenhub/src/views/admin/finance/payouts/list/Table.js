/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/anchor-is-valid */
// ** React Imports
import {
  Fragment, useState, useEffect, forwardRef,
} from 'react';
import { Link, useLocation } from 'react-router-dom';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';

// ** Third Party Components
import {
  ChevronDown,
} from 'react-feather';
import DataTable from 'react-data-table-component';

import {
  Card, CardBody, Row, Col,
} from 'reactstrap';

import paginationRowsPerPageOptions from '@src/models/constants/paginationRowsPerPageOptions';
import { getTransactions } from '@store/actions/payment.actions';

import { columns } from './columns';

// ** Custom Components

// constants

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss';
import '@styles/react/libs/tables/react-dataTable-component.scss';

// const statusOptions = [
//   { value: 'pending', label: 'Pending (awaiting approval)' },
//   { value: 'active', label: 'active' },
//   { value: 'declined', label: 'declined' },
//   { value: 'fulfilled', label: 'fulfilled' },
// ];

const TransactionList = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions);
  const { search } = useLocation();

  // ** States
  const [searchTerm, setSearchTerm] = useState(transactions.params?.q ? transactions.params.q : '');
  const [currentPage, setCurrentPage] = useState(transactions.params?.currentPage ? transactions.params.currentPage : 1);
  const [rowsPerPage, setRowsPerPage] = useState(transactions.params?.rowsPerPage ? transactions.params.rowsPerPage : 15);
  const [status, setStatus] = useState('');

  // Set dispatch construct
  const dispatchParams = {
    currentPage,
    rowsPerPage,
    q: searchTerm,
    type: 'payout',
  };

  // ** Get data on mount
  useEffect(() => {
    dispatch(getTransactions(dispatchParams));
  }, []);

  // ** Function in get data on search query change
  const handleFilter = (q) => {
    setSearchTerm(q);
    dispatch(
      getTransactions({
        ...dispatchParams,
        q,
      })
    );
  };

  // ** Function to persist
  const handlePaginationChange = (currentPage) => {
    setCurrentPage(currentPage);
    dispatch(
      getTransactions({
        ...dispatchParams,
        currentPage,
      })
    );
  };

  const handleRowPerPageChange = (rowsPerPage, currentPage) => {
    setRowsPerPage(rowsPerPage);
    setCurrentPage(currentPage);
    dispatch(
      getTransactions({
        ...dispatchParams,
        rowsPerPage,
        currentPage,
      })
    );
  };

  const handleStatusFilter = (filterStatus) => {
    setStatus(filterStatus);
    dispatch(getTransactions(dispatchParams, filterStatus));
  };

  return (
    <>
      <Row className="table-header">
        {/* <small>List</small> */}

        <Col>
          <h3>Payout Transactions</h3>
          <small>Payout transactions are created when a vendor fulfills an order event</small>
        </Col>
        {/* <Col
          xl="4"
          className="text-right"
        >
          <Button.Ripple
            size="sm"
            color="primary"
            tag={Link}
            to="/vendor/order-dates/add/"
          >
            <Plus size={14} />
            <span className="align-middle "> Add Order Date</span>
          </Button.Ripple>
        </Col> */}
      </Row>

      <Card>

        <CardBody>
          {/* <Row className="justify-content-between">

            <Col
              className="d-flex align-items-center"
            >
              <div className="filter-list-inline">
                <ul className="list-inline list-unstyled">
                  <li className="card-list-inline-item">
                    <Badge color={status === '' ? 'light-success' : 'light-secondary'} onClick={(e) => handleStatusFilter('')}>
                      All
                    </Badge>
                  </li>
                  <li className="card-list-inline-item">
                    <Badge color={status === 'pending' ? 'light-success' : 'light-secondary'} onClick={(e) => handleStatusFilter('pending')}>
                      Awaiting Approval
                    </Badge>
                  </li>
                  <li className="card-list-inline-item">
                    <Badge color={status === 'active' ? 'light-success' : 'light-secondary'} onClick={(e) => handleStatusFilter('active')}>
                      Upcoming
                    </Badge>
                  </li>
                  <li className="card-list-inline-item">
                    <Badge color={status === 'fulfilled' ? 'light-success' : 'light-secondary'} onClick={(e) => handleStatusFilter('fulfilled')}>
                      Fulfilled
                    </Badge>
                  </li>
                  <li className="card-list-inline-item">
                    <Badge color={status === 'declined' ? 'light-success' : 'light-secondary'} onClick={(e) => handleStatusFilter('declined')}>
                      Declined
                    </Badge>
                  </li>
                </ul>
              </div>
            </Col>

          </Row> */}
        </CardBody>

        <DataTable
          data={transactions.data}
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

export default TransactionList;
