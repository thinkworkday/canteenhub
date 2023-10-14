// ** React Imports
import { useState } from 'react';
import { Link } from 'react-router-dom';

// ** 3rd party
import moment from 'moment';

// ** Custom Components

// ** Store & Actions
import { store } from '@store/storeConfig/store';
import { useDispatch } from 'react-redux';

// ** Third Party Components
import {
  Alert, Badge, Button, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Spinner,
} from 'reactstrap';
import {
  MoreVertical, CheckCircle, Trash2, Archive, XCircle,
} from 'react-feather';
import { toast } from 'react-toastify';
import {
  getUser, approveUser, declineUser, deleteUser,
} from '@store/actions/user.actions';

// ** Renders Bank Account
const renderBankAccStatus = (row) => {
  const status = (row.stripeAccountStatus ? row.stripeAccountStatus : 'not started');
  let color = 'light-primary';
  switch (status) {
    case 'in progress':
      color = 'light-secondary';
      break;
    case 'active':
      color = 'light-success';
      break;
    default:
      break;
  }

  return (
    <Badge color={color} pill>
      {status}
    </Badge>
  );
};

export const storeColumns = [
  {
    name: 'Name',
    minWidth: '200px',
    selector: (row) => `${row.storeName}`,
    sortable: true,
  },
  {
    name: 'Email',
    minWidth: '250px',
    selector: (row) => `${row.storeEmail}`,
    sortable: true,
  },
  {
    name: 'Bank Account',
    sortable: true,
    minWidth: '300px',
    cell: (row) => renderBankAccStatus(row),
  },
  {
    name: 'Last Active',
    sortable: true,
    selector: (row) => moment(row.lastLogin).format('lll'),
    // format: (row) => moment(row.lastLogin).format('lll'),
  },
  {
    name: 'Actions',
    minWidth: '100px',
    cell: (row) => {
      const [modalVisibility, setModalVisibility] = useState(false);
      const [apiErrors, setApiErrors] = useState({});
      const [actionProcessing, setActionProcessing] = useState(false);
      const dispatch = useDispatch();

      const handleApproveUser = async (userId) => {
        setActionProcessing(true);
        try {
          await dispatch(approveUser(`${userId}`));
          toast.success(
            <>
              <CheckCircle className="mr-1 text-success" />
              User has been approved
            </>, {
              hideProgressBar: true,
            }
          );
          setActionProcessing(false);
        } catch (err) {
          setApiErrors(err.response ? err.response : { data: err.response.data });
        }
      };

      const handleDeclineUser = async (userId) => {
        setActionProcessing(true);
        try {
          await dispatch(declineUser(`${userId}`));
          toast.success(
            <>
              <XCircle className="mr-1 text-danger" />
              User has been declined
            </>, {
              hideProgressBar: true,
            }
          );
          setActionProcessing(false);
        } catch (err) {
          setApiErrors(err.response ? err.response : { data: err.response.data });
        }
      };

      const handleDeleteUser = async (userId) => {
        try {
          await dispatch(deleteUser(`${userId}`));
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

            <DropdownToggle tag="div" className="btn btn-sm text-center">
              {!actionProcessing ? (<MoreVertical size={14} className="cursor-pointer action-btn" />) : (<Spinner size="sm" color="primary" />) }
            </DropdownToggle>

            <DropdownMenu right>
              {row.status === 'pending' ? (
                <DropdownItem
                  className="w-100"
                  onClick={() => handleApproveUser(row._id)}
                >
                  <CheckCircle size={14} className="mr-50" />
                  <span className="align-middle">Approve</span>
                </DropdownItem>
              ) : ''}

              {row.status === 'pending' ? (
                <DropdownItem
                  to={`/apps/user/view/${row._id}`}
                  className="w-100"
                  onClick={() => handleDeclineUser(row._id)}
                >
                  <XCircle size={14} className="mr-50" />
                  <span className="align-middle">Decline</span>
                </DropdownItem>
              ) : ''}

              <DropdownItem
                tag={Link}
                to={`/admin/users/vendors/store/edit/${row._id}`}
                className="w-100"
                onClick={() => store.dispatch(getUser(row._id))}
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
              <Button color="primary" onClick={() => handleDeleteUser(row._id, store.params)}>
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
