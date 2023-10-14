/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/anchor-is-valid */
// ** React Imports
import { Fragment, useState, useEffect } from 'react';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';

// ** Third Party Components
import {
  ChevronDown, Filter, Download,
} from 'react-feather';
import DataTable from 'react-data-table-component';

import {
  Card, CardBody, Row, Col, Button,
} from 'reactstrap';

import paginationRowsPerPageOptions from '@src/models/constants/paginationRowsPerPageOptions';
import { getOrders } from '@store/actions/order.actions';
import { getOrderFilter } from '@store/actions/orderFilter.actions';
import ModalDeleteRecord from '@src/components/modals/ModalDeleteRecord';
import classnames from 'classnames';
import { CSVLink } from 'react-csv';
import moment from 'moment';
import { priceFormatter } from '@utils';
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
  const orders = useSelector((state) => state.orders);
  const { orderFilter } = useSelector((state) => state.orderFilter);

  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get('status');
  const upcoming = urlParams.get('upcoming');
  const orderNoteStatus = urlParams.get('orderNoteStatus');

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
  const [searchTerm, setSearchTerm] = useState(orders.params?.q ? orders.params.q : '');
  const [currentPage, setCurrentPage] = useState(orders.params?.currentPage ? orders.params.currentPage : 1);
  const [rowsPerPage, setRowsPerPage] = useState(orders.params?.rowsPerPage ? orders.params.rowsPerPage : 15);
  const [dispatchParams, setDispatchParams] = useState({
    currentPage: orderFilter.currentPage ? orderFilter.currentPage : currentPage,
    rowsPerPage: orderFilter.rowsPerPage ? orderFilter.rowsPerPage : rowsPerPage,
    q: orderFilter.q ? orderFilter.q : searchTerm,
    status: orderFilter.status ? orderFilter.status : status,
    upcoming: !!(upcoming && upcoming === 'true'),
    orderNoteStatus: orderFilter.orderNoteStatus ? orderFilter.orderNoteStatus : orderNoteStatus,
  });

  const [filterCount, setFilterCount] = useState({});
  const [csvData, setCsvData] = useState();

  // ** Filter sidebar
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const handleFilterSidebar = () => setFilterSidebarOpen(!filterSidebarOpen);

  // ** Get data on mount
  useEffect(() => {
    if (Object.keys(orderFilter).length === 0) {
      dispatch(getOrders(dispatchParams));
    } else {
      dispatch(getOrders(orderFilter));
    }
    dispatch(getOrderFilter(orderFilter));

    // Configure CSV data
    const csvDataObj = orders.data.map((row) => {
      const modificationNotes = row.orderNotes.length > 0 ? row.orderNotes.length === 1 ? row.orderNotes.map((orderNote) => orderNote.notes)[0] : row.orderNotes.map((orderNote) => orderNote.notes).join(', ') : '';
      const csvObj = {
        eventDate: moment(new Date(row.eventDate), 'DD/MM/YYYY').format('DD/MM/YYYY'),
        orderNumber: row.orderNumber,
        orderName: `${row.profile[0].firstName} ${row.profile[0].lastName}`,
        group: `${row.profile[0].group.companyName}`,
        subGroup: `${row.profile[0].subgroups[0].name}`,
        orderStatus: row.status,
        currency: row.orderTotals[0].orderCurrency ? row.orderTotals[0].orderCurrency : 'AUD',
        orderTotal: priceFormatter(row.orderTotals[0].orderLinesSubtotal),
        modificationNotes: `${modificationNotes}`,
        allergyInfo: `${row.profile[0].allergies}`,
        notes: `${row.profile[0].notes}`,
      };
      return csvObj;
    });
    setCsvData(csvDataObj);
  }, [dispatch, orders.data.length]);

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
      getOrders({
        ...dispatchParams,
        currentPage,
      })
    );
    orderFilter.currentPage = currentPage;
    dispatch({
      type: 'GET_ORDER_FILTER',
      orderFilter,
    });
  };

  const handleRowPerPageChange = (rowsPerPage, currentPage) => {
    setRowsPerPage(rowsPerPage);
    setCurrentPage(currentPage);
    dispatch(
      getOrders({
        ...dispatchParams,
        rowsPerPage,
        currentPage,
      })
    );
    orderFilter.currentPage = currentPage;
    orderFilter.rowsPerPage = rowsPerPage;
    dispatch({
      type: 'GET_ORDER_FILTER',
      orderFilter,
    });
  };

  return (
    <>
      <Row className="table-header">
        <Col>
          <h3>Orders</h3>
        </Col>
        <Col
          xl="4"
          className="text-right"
        />
      </Row>

      <Card>
        <CardBody>
          <Row className="justify-content-end">
            <Col
              xl="6"
              className="d-flex align-items-center justify-content-end"
            >
              <CSVLink className="waves-effect btn btn-outline-primary btn-sm" data={csvData || ''} filename={`orders-${moment().format('YYYYMMDDHHmmss')}.csv`}>
                <Download size={14} />
                {' '}
                CSV Export
              </CSVLink>
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
        </CardBody>

        <DataTable
          data={orders.data}
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

      <ModalDeleteRecord modalVisibility={modalDeleteRecordVisibility} modalToggle={() => toggleDeleteRecordModal()} recordSource="Menu" recordId={deleteId} />

      <FilterSidebar
        open={filterSidebarOpen}
        dispatchParams={dispatchParams}
        setDispatchParams={setDispatchParams}
        handleFilterSidebar={handleFilterSidebar}
        orderFilter={orderFilter}
      />

    </>
  );
};

export default OrdersList;
