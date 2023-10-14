// ** React Imports
import { useState } from 'react';
import { Link } from 'react-router-dom';

// ** Custom Components
import moment from 'moment';

// ** Store & Actions
import { store } from '@store/storeConfig/store';
import { useDispatch } from 'react-redux';

// ** Third Party Components
import {
  Alert, Badge, Button, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';
import {
  MoreVertical, CheckCircle, Check, Trash2, Archive, X,
} from 'react-feather';
import { toast } from 'react-toastify';
import { getStoreUser, deleteStoreUser } from '@store/actions/vendor.actions';

const renderEmail = (row) => (
  <span>
    {row.email}
    {' '}
    {row.emailVerified ? (
      <Check size="16px" className="text-success" />
    ) : (<X size="16px" className="text-danger" />) }
  </span>
);

const renderStore = (row) => (
  <span>
    Subs For You Frankston
  </span>
);

export const columns = [
  {
    name: 'Name',
    selector: (row) => `${row.firstName} ${row.lastName}`,
    sortable: true,
  },
  {
    name: 'Email',
    minWidth: '250px',
    cell: (row) => renderEmail(row),
    sortable: true,
  },
  {
    name: 'Last Login',
    sortable: true,
    selector: (row) => row.lastLogin,
    format: (row) => moment(row.lastLogin).format('lll'),
  },
  {
    name: 'Stores',
    minWidth: '250px',
    cell: (row) => renderStore(row),
    sortable: true,
  },
  {
    name: 'Actions',
    minWidth: '100px',
    cell: (row) => {
      const [modalVisibility, setModalVisibility] = useState(false);
      const [apiErrors, setApiErrors] = useState({});
      const dispatch = useDispatch();

      const handleDeleteUser = async (userId) => {
        try {
          await dispatch(deleteStoreUser(`${userId}`));
          toast.success(
            <>
              <CheckCircle className="mr-1 text-success" />
              User successfully deleted
            </>, {
              hideProgressBar: true,
            }
          );
          setModalVisibility(!modalVisibility);
        } catch (err) {
          setApiErrors(err.response ? err.response : { data: err.response.data });
        }
      };

      return (

        <>
          <UncontrolledDropdown>
            <DropdownToggle tag="div" className="btn btn-sm">
              <MoreVertical size={14} className="cursor-pointer action-btn" />
            </DropdownToggle>
            <DropdownMenu right>
              {/* <DropdownItem
            tag={Link}
            to={`/apps/user/view/${row._id}`}
            className="w-100"
            onClick={() => store.dispatch(getUser(row._id))}
          >
            <FileText size={14} className="mr-50" />
            <span className="align-middle">Details</span>
          </DropdownItem> */}
              <DropdownItem
                tag={Link}
                to={`/vendor/store-users/edit/${row._id}`}
                className="w-100"
                onClick={() => store.dispatch(getStoreUser(row._id))}
              >
                <Archive size={14} className="mr-50" />
                <span className="align-middle">Edit</span>
              </DropdownItem>
              {/* <DropdownItem className="w-100" onClick={() => store.dispatch(deleteUser(row._id))}> */}
              <DropdownItem className="w-100" onClick={() => setModalVisibility(!modalVisibility)}>
                <Trash2 size={14} className="mr-50" />
                <span className="align-middle">Delete</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <Modal isOpen={modalVisibility} toggle={() => setModalVisibility(!modalVisibility)}>
            <ModalHeader toggle={() => setModalVisibility(!modalVisibility)}>Confirm Delete?</ModalHeader>
            <ModalBody>
              { apiErrors.data ? (
                <Alert color="danger">
                  <div className="alert-body">
                    <span>{`Error: ${apiErrors.data}`}</span>
                  </div>
                </Alert>
              ) : <></>}
              Are you sure you want to delete?
              <div><strong>{row.email}</strong></div>
            </ModalBody>
            <ModalFooter className="justify-content-start">
              <Button color="primary" onClick={() => handleDeleteUser(row._id)}>
                Yes, Please Delete
              </Button>
              <Button color="secondary" onClick={() => setModalVisibility(!modalVisibility)} outline>
                No
              </Button>
            </ModalFooter>
          </Modal>
        </>
      );
    },
  },
];
