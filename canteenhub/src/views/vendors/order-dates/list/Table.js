/* eslint-disable jsx-a11y/anchor-is-valid */
// ** React Imports
import { Fragment, useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '@store/actions/event.actions';

// ** Third Party Components
import {
  ChevronDown, Plus, Filter,
} from 'react-feather';
import DataTable from 'react-data-table-component';

import {
  Card, CardBody, Row, Col, Button,
} from 'reactstrap';

import paginationRowsPerPageOptions from '@src/models/constants/paginationRowsPerPageOptions';

import classnames from 'classnames';
import {
  selectEvent, updateEvent, addEvent, removeEvent,
} from '../../../calendar/store/actions';

import AddEventSidebar from '../../../calendar/AddEventSidebar';

// ** utils
import { columns } from './columns';

// ** Custom Components
import FilterSidebar from './FilterSidebar';

const UsersList = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.events);

  // ** States
  const [addSidebarOpen, setAddSidebarOpen] = useState(false);
  const [filterCount, setFilterCount] = useState({});

  const [searchTerm, setSearchTerm] = useState(store.params?.q ? store.params.q : '');
  const [currentPage, setCurrentPage] = useState(store.params?.currentPage ? store.params.currentPage : 1);
  const [rowsPerPage, setRowsPerPage] = useState(store.params?.rowsPerPage ? store.params.rowsPerPage : 15);
  const [dispatchParams, setDispatchParams] = useState({
    currentPage,
    rowsPerPage,
    q: searchTerm,
  });

  // ** AddEventSidebar Toggle Function
  const handleAddEventSidebar = () => setAddSidebarOpen(!addSidebarOpen);

  // ** Filter sidebar
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const handleFilterSidebar = () => setFilterSidebarOpen(!filterSidebarOpen);

  // ** Get data on mount
  useEffect(() => {
    dispatch(fetchEvents(dispatchParams));
  }, [dispatch, store.events.length]);

  // ** Function to handle Add Event Click
  const handleAddEventClick = () => {
    dispatch(selectEvent({}));
    handleAddEventSidebar();
  };

  const handleFilterClick = () => {
    handleFilterSidebar();
  };

  // ** Function in get data on search query change
  // const handleFilter = (q) => {
  //   setSearchTerm(q);
  //   dispatch(
  //     fetchEvents({
  //       ...dispatchParams,
  //       q,
  //     })
  //   );
  // };

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

  // ** refetchEvents
  const refetchEvents = () => {
    dispatch(
      fetchEvents({
        dispatchParams,
      })
    );
  };

  return (
    <>
      <Row className="table-header">
        <Col>
          <h3>Events</h3>
          <small>Setup dates and events for groups and schools to order. Customers can only place orders on these dates.</small>
        </Col>
        <Col
          xl="4"
          className="d-flex align-items-center justify-content-end"
        >
          <Button.Ripple
            size="sm"
            color="primary"
            onClick={handleAddEventClick}
          >
            <Plus size={14} />
            <span className="align-middle "> Add Event</span>
          </Button.Ripple>
        </Col>
      </Row>

      <Card>

        <CardBody>
          <Row className="justify-content-end">
            <Col
              xl="4"
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
      </Card>

      <AddEventSidebar
        store={store}
        dispatch={dispatch}
        addEvent={addEvent}
        open={addSidebarOpen}
        selectEvent={selectEvent}
        updateEvent={updateEvent}
        removeEvent={removeEvent}
        refetchEvents={refetchEvents}
        handleAddEventSidebar={handleAddEventSidebar}
      />

      <FilterSidebar
        open={filterSidebarOpen}
        dispatchParams={dispatchParams}
        setDispatchParams={setDispatchParams}
        handleFilterSidebar={handleFilterSidebar}
      />

    </>
  );
};

export default UsersList;
