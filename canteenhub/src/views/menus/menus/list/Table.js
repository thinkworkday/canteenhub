/* eslint-disable jsx-a11y/anchor-is-valid */
// ** React Imports
import { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';
import paginationRowsPerPageOptions from '@src/models/constants/paginationRowsPerPageOptions';
import { getMenus } from '@store/actions/menu.actions';
import ModalDeleteRecord from '@src/components/modals/ModalDeleteRecord';
import { getLoggedUser } from '@utils';

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
// import { columnsReadOnly } from './columnsReadOnly';
import { columns } from './columns';

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss';
import '@styles/react/libs/tables/react-dataTable-component.scss';

// ** Custom Components

// ** Constants
const pageObj = 'menus';

const UsersList = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.menus);

  // const { search } = useLocation();
  const loggedUser = getLoggedUser();

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
  const [searchTerm, setSearchTerm] = useState(store.params?.q ? store.params.q : '');
  const [currentPage, setCurrentPage] = useState(store.params?.currentPage ? store.params.currentPage : 1);
  const [rowsPerPage, setRowsPerPage] = useState(store.params?.rowsPerPage ? store.params.rowsPerPage : 15);

  // Set dispatch construct
  const dispatchParams = {
    currentPage,
    rowsPerPage,
    q: searchTerm,
  };

  // ** Get data on mount
  useEffect(() => {
    dispatch(getMenus(dispatchParams));
  }, [dispatch, store.data.length]);

  // ** Function in get data on search query change
  const handleFilter = (q) => {
    setSearchTerm(q);
    dispatch(
      getMenus({
        ...dispatchParams,
        q,
      })
    );
  };

  // ** Function to persist
  const handlePaginationChange = (currentPage) => {
    setCurrentPage(currentPage);
    dispatch(
      getMenus({
        ...dispatchParams,
        currentPage,
      })
    );
  };

  const handleRowPerPageChange = (rowsPerPage, currentPage) => {
    setRowsPerPage(rowsPerPage);
    setCurrentPage(currentPage);
    dispatch(
      getMenus({
        ...dispatchParams,
        rowsPerPage,
        currentPage,
      })
    );
  };

  // console.log('loggedUser', loggedUser);

  return (
    <>

      <Row className="table-header">
        <Col>
          <h3>Menus</h3>
          {loggedUser.role === 'vendor' || loggedUser.role === 'store' ? <small>The following are menus available to your account. Default menus are created by admin, however you may create variations of these menus if you wish</small> : ''}
        </Col>
        <Col
          xl="4"
          className="text-right"
        >

          {loggedUser.role === 'vendor' || loggedUser.role === 'store' ? (
            <Button.Ripple
              size="sm"
              color="primary"
              tag={Link}
              to={`/${loggedUser.role}/${pageObj}/add`}
            >
              <Plus size={14} />
              <span className="align-middle "> Create menu variation</span>
            </Button.Ripple>
          ) : ''}

          {loggedUser.role === 'admin' ? (
            <Button.Ripple
              size="sm"
              color="primary"
              tag={Link}
              to={`/admin/${pageObj}/add`}
            >
              <Plus size={14} />
              <span className="align-middle "> Create Menu</span>
            </Button.Ripple>
          ) : '' }

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
          columns={columns(toggleDeleteRecordModal)}
          sortIcon={<ChevronDown />}
          paginationDefaultPage={currentPage}
          onChangePage={(page) => { handlePaginationChange(page); }}
          onChangeRowsPerPage={(currentRowsPerPage, currentPage) => { handleRowPerPageChange(currentRowsPerPage, currentPage); }}
        />
      </Card>

      <ModalDeleteRecord modalVisibility={modalDeleteRecordVisibility} modalToggle={() => toggleDeleteRecordModal()} recordSource="Menu" recordId={deleteId} />

    </>
  );
};

export default UsersList;
