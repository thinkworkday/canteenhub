/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/anchor-is-valid */
// ** React Imports
import {
  Fragment, useState, useEffect,
} from 'react';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';

// import ReactPaginate from 'react-paginate';
import {
  ChevronDown, Filter,
} from 'react-feather';
import DataTable from 'react-data-table-component';

import {
  Card, CardBody, Row, Col, Button,
} from 'reactstrap';

import paginationRowsPerPageOptions from '@src/models/constants/paginationRowsPerPageOptions';
import { fetchEvents } from '@store/actions/event.actions';

import { columns } from './columns';

// ** Custom Components
import FilterSidebar from './FilterSidebar';

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss';
import '@styles/react/libs/tables/react-dataTable-component.scss';

const UsersList = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.events);

  // ** States
  const [searchTerm, setSearchTerm] = useState(store.params?.q ? store.params.q : '');
  const [currentPage, setCurrentPage] = useState(store.params?.currentPage ? store.params.currentPage : 1);
  const [rowsPerPage, setRowsPerPage] = useState(store.params?.rowsPerPage ? store.params.rowsPerPage : 15);
  const [status, setStatus] = useState('');

  const [dispatchParams, setDispatchParams] = useState({
    currentPage,
    rowsPerPage,
    q: searchTerm,
  });

  // ** Filter sidebar
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const handleFilterSidebar = () => setFilterSidebarOpen(!filterSidebarOpen);

  // ** Get data on mount
  useEffect(() => {
    dispatch(fetchEvents(dispatchParams));
  }, []);

  const handleFilterClick = () => {
    handleFilterSidebar();
  };

  // ** Function in get data on search query change
  const handleFilter = (q) => {
    setSearchTerm(q);
    dispatch(
      fetchEvents({
        ...dispatchParams,
        q,
      })
    );
  };

  // ** Function to persist
  const handlePaginationChange = (currentPage) => {
    setCurrentPage(currentPage);
    dispatch(
      fetchEvents({
        ...dispatchParams,
        currentPage,
      })
    );
  };

  const handleRowPerPageChange = (rowsPerPage, currentPage) => {
    setRowsPerPage(rowsPerPage);
    setCurrentPage(currentPage);
    dispatch(
      fetchEvents({
        ...dispatchParams,
        rowsPerPage,
        currentPage,
      })
    );
  };

  const handleStatusFilter = (filterStatus) => {
    setStatus(filterStatus);
    dispatch(fetchEvents(dispatchParams, filterStatus));
  };

  return (
    <>
      <Row className="table-header">
        {/* <small>List</small> */}

        <Col>
          <h3>Events</h3>
          <small>The following are a list of dates that are setup for your school to be able to make orders</small>
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
          <Row className="justify-content-end">

            {/* <Col
              className="d-flex align-items-center"
            >
              <div className="filter-list-inline">
                <ul className="list-inline list-unstyled flex-wrap flex-sm-nowrap">
                  <li className="card-list-inline-item m-25">
                    <Badge color={status === '' ? 'light-success' : 'light-secondary'} onClick={(e) => handleStatusFilter('')}>
                      All
                    </Badge>
                  </li>
                  <li className="card-list-inline-item m-25">
                    <Badge color={status === 'pending' ? 'light-success' : 'light-secondary'} onClick={(e) => handleStatusFilter('pending')}>
                      Awaiting Approval
                    </Badge>
                  </li>
                  <li className="card-list-inline-item m-25">
                    <Badge color={status === 'active' ? 'light-success' : 'light-secondary'} onClick={(e) => handleStatusFilter('active')}>
                      Upcoming
                    </Badge>
                  </li>
                  <li className="card-list-inline-item m-25">
                    <Badge color={status === 'fulfilled' ? 'light-success' : 'light-secondary'} onClick={(e) => handleStatusFilter('fulfilled')}>
                      Fulfilled
                    </Badge>
                  </li>
                  <li className="card-list-inline-item m-25">
                    <Badge color={status === 'declined' ? 'light-success' : 'light-secondary'} onClick={(e) => handleStatusFilter('declined')}>
                      Declined
                    </Badge>
                  </li>
                </ul>
              </div>
            </Col> */}

            <Col
              xl="4"
              className="d-flex align-items-center justify-content-end"
            >
              <Button.Ripple
                size="sm"
                color="primary"
                outline
                // className={classnames({
                //   'ml-1': true,
                //   active: filterCount > 0,
                // })}
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
          data={store.events}
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

        <FilterSidebar
          open={filterSidebarOpen}
          dispatchParams={dispatchParams}
          setDispatchParams={setDispatchParams}
          handleFilterSidebar={handleFilterSidebar}
        />
      </Card>

    </>
  );
};

export default UsersList;
