/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/anchor-is-valid */
// ** React Imports
import {
  Fragment, useState, useEffect, forwardRef, useCallback,
} from 'react';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';

// ** Third Party Components
import {
  ChevronDown,
} from 'react-feather';
import DataTable from 'react-data-table-component';

import {
  Card, CardBody, Row, Col, Button,
} from 'reactstrap';

import paginationRowsPerPageOptions from '@src/models/constants/paginationRowsPerPageOptions';
import { fetchEvents } from '@store/actions/event.actions';

import classnames from 'classnames';
import ModalConfirmApprove from './ModalConfirmApprove';
import ModalConfirmDecline from './ModalConfirmDecline';

import { columns } from './columns';

// ** Custom Components

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss';
import '@styles/react/libs/tables/react-dataTable-component.scss';

const UsersList = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.events);
  // const { search } = useLocation();

  // ** States
  const [searchTerm, setSearchTerm] = useState(store.params?.q ? store.params.q : '');
  const [currentPage, setCurrentPage] = useState(store.params?.currentPage ? store.params.currentPage : 1);
  const [rowsPerPage, setRowsPerPage] = useState(store.params?.rowsPerPage ? store.params.rowsPerPage : 15);
  // const [status, setStatus] = useState('');

  const [modalConfirmVisibility, setModalConfirmVisibility] = useState(false);
  const [modalDeclineVisibility, setModalDeclineVisibility] = useState(false);

  const toggleConfirmModal = () => {
    setModalConfirmVisibility(!modalConfirmVisibility);
  };

  const toggleDeclineModal = () => {
    setModalDeclineVisibility(!modalDeclineVisibility);
  };

  // Set dispatch construct
  const dispatchParams = {
    currentPage,
    rowsPerPage,
    q: searchTerm,
    upcoming: true,
  };

  // ** Get data on mount
  useEffect(() => {
    dispatch(fetchEvents(dispatchParams, 'pending'));
  }, []);

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

  // ** Bootstrap Checkbox Component
  const BootstrapCheckbox = forwardRef(({ onClick, ...rest }, ref) => (
    <div className="custom-control custom-checkbox">
      <input type="checkbox" className="custom-control-input" ref={ref} {...rest} />
      <label className="custom-control-label" onClick={onClick} />
    </div>
  ));

  const [selectedRows, setSelectedRows] = useState([]);
  // const [toggleCleared, setToggleCleared] = useState(false);

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handleApprove = () => {
    toggleConfirmModal();
  };

  const handleDecline = () => {
    toggleDeclineModal();
  };

  return (
    <>
      <Row className="table-header">
        {/* <small>List</small> */}

        <Col lg="6">
          <h3>
            Pending Events
            {' '}
            {/* {store.events.length > 0 ? `(${store.events.length})` : '' } */}
          </h3>
          <small className="d-block">The following events have been created by stores and currently awaiting your approval. In order for customers to be able to place orders, the event must be active</small>
        </Col>
      </Row>

      <Card>

        <CardBody>
          <Row className="justify-content-between">

            <Col
              className="d-flex align-items-center justify-content-between"
            >
              <p className="m-0">

                {' '}
                {selectedRows && selectedRows.length > 0 ? `${selectedRows.length} items selected` : 'Please select date(s) in order to approve / decline'}
              </p>

              <div className={classnames('actionButtons d-none', {
                'd-flex': selectedRows && selectedRows.length > 0,
              })}
              >
                <Button.Ripple
                  size="sm"
                  color="success"
                  className="mr-1"
                  onClick={() => handleApprove()}
                >
                  Approve
                </Button.Ripple>

                <Button.Ripple
                  size="sm"
                  color="danger"
                  outline
                  onClick={() => handleDecline()}
                >
                  Decline
                </Button.Ripple>
              </div>
            </Col>

            {/* <Col
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
            </Col> */}
          </Row>
        </CardBody>

        <DataTable
          data={store.events}
          responsive
          selectableRows
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
          selectableRowsComponent={BootstrapCheckbox}
          // contextActions={contextActions}
          onSelectedRowsChange={handleRowSelected}
        />
      </Card>

      <ModalConfirmApprove modalVisibility={modalConfirmVisibility} modalToggle={() => toggleConfirmModal()} selectedRows={selectedRows} />
      <ModalConfirmDecline modalVisibility={modalDeclineVisibility} modalToggle={() => toggleDeclineModal()} selectedRows={selectedRows} />

    </>
  );
};

export default UsersList;
