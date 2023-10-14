// ** React Imports
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

// ** Store & Actions
import { store } from '@store/storeConfig/store';
import { useDispatch } from 'react-redux';

// ** Third Party Components
import {
  Alert, Badge, Button, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';

import AvatarGroup from '@components/avatar-group';
import {
  MoreVertical, CheckCircle, Trash2, Archive,
} from 'react-feather';
import { toast } from 'react-toastify';
import { getStore, addBankAccount, updateStore } from '@store/actions/vendor.actions';

import { getInitials, getLoggedUser } from '@utils';

// ** Renders Image Columns
const renderImage = (row) => {
  if (row.storeLogo) {
    return <img src={row.storeLogo} alt="logo" className="img-fluid" />;
  }
  return (<></>);
};

// ** Renders User Columns
const renderUsers = (row) => {
  const avatarGroupData = row.storeUsers.map((item) => ({
    content: getInitials(`${item.firstName} ${item.lastName ? item.lastName : ''}`),
    size: 'sm',
    title: item.firstName,
  }));

  return <AvatarGroup data={avatarGroupData} />;
};

const bankAccountHandler = async (data) => {
  addBankAccount(data, (err, url) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log('err', err);
    } else {
      const win = window.open(url, '_blank');
      win.focus();
    }
  });
};
// ** Renders Bank Account
const renderBankAccStatus = (row, history) => {
  const status = (row.stripeAccountStatus ? row.stripeAccountStatus : 'not started');
  let color = 'light-primary';
  let ctaLabel = 'Get Connected';
  switch (status) {
    case 'in progress':
      color = 'light-secondary';
      ctaLabel = 'Continue Application';
      break;
    case 'active':
      color = 'light-success';
      ctaLabel = '';
      break;
    default:
      break;
  }

  return (
    <>
      <Badge color={color} pill>
        {status}
      </Badge>
      {' '}
      {ctaLabel ? (<Button.Ripple onClick={() => bankAccountHandler(row, history)} color="flat-secondary" size="sm">Get Connected &gt;</Button.Ripple>) : <></> }
    </>
  );
};

export const columns = () => {
  const loggedUser = getLoggedUser();
  const history = useHistory();
  return [
    {
      name: '',
      maxWidth: '100px',
      selector: (row) => renderImage(row),
    },
    {
      name: 'Store Name',
      selector: (row) => `${row.storeName}`,
      sortable: true,
    },
    {
      name: 'Store Email',
      selector: (row) => row.storeEmail,
      sortable: true,
    },
    {
      name: 'Users',
      sortable: true,
      cell: (row) => renderUsers(row),
    },
    {
      name: 'Bank Account',
      sortable: true,
      minWidth: '300px',
      cell: (row) => renderBankAccStatus(row, history),
    },
    {
      name: 'Actions',
      width: '120px',
      cell: (row) => {
        const [modalVisibility, setModalVisibility] = useState(false);
        const [apiErrors, setApiErrors] = useState({});
        const dispatch = useDispatch();

        const handleDeleteUser = async (storeObjId) => {
          // console.log('delete Store', storeObjId);
          try {
            await dispatch(updateStore(`${storeObjId}`, { status: 'deleted' }));
            toast.success(
              <>
                <CheckCircle className="mr-1 text-success" />
                Store successfully deleted
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
                <DropdownItem
                  tag={Link}
                  to={`/${loggedUser.role}/store/edit/${row._id}`}
                  className="w-100"
                  onClick={() => store.dispatch(getStore(row._id))}
                >
                  <Archive size={14} className="mr-50" />
                  <span className="align-middle">Edit</span>
                </DropdownItem>
                {loggedUser.role !== 'store' ? (
                  <DropdownItem className="w-100" onClick={() => setModalVisibility(!modalVisibility)}>
                    <Trash2 size={14} className="mr-50" />
                    <span className="align-middle">Delete</span>
                  </DropdownItem>
                ) : <></>}
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
};
