// ** React Imports
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
// ** Custom Components
import moment from 'moment';

// ** Store & Actions
import { store } from '@store/storeConfig/store';
import { useDispatch } from 'react-redux';
import { updateSubgroup } from '@store/actions/group.actions';

// ** Third Party Components
import {
  Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Col, Input,
} from 'reactstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import {
  MoreVertical, CheckCircle, Trash2, Archive, Send, Link2, Copy,
} from 'react-feather';
import { toast } from 'react-toastify';
// import { updateStore } from '@store/actions/vendor.actions';

// import { getInitials } from '@utils';

export const columns = () => {
  const history = useHistory();
  return [
    {
      name: 'Name',
      selector: (row) => `${row.name}`,
      sortable: true,
    },
    // {
    //   name: 'Description',
    //   selector: (row) => `${row.description}`,
    //   sortable: true,
    // },
    {
      name: 'Contact Person',
      selector: (row) => `${row.contactFirstName} ${row.contactLastName}`,
      sortable: true,
    },
    // {
    //   name: 'Contact Email',
    //   selector: (row) => `${row.contactEmail}`,
    //   sortable: true,
    // },
    // {
    //   name: 'Customers',
    //   selector: (row) => 'X (number)',
    //   sortable: true,
    // },
    {
      name: 'Last Modified',
      sortable: true,
      selector: (row) => row.updatedAt,
      format: (row) => moment(row.updatedAt).fromNow(),
    },
    {
      name: 'Actions',
      width: '120px',
      cell: (row) => {
        const [modalVisibility, setModalVisibility] = useState(false);
        const [modalVisibilityInvite, setModalVisibilityInvite] = useState(false);
        const [apiErrors, setApiErrors] = useState({});
        const dispatch = useDispatch();

        const [inviteLink, setInviteLink] = useState(row._id);
        const [copied, setCopied] = useState(false);
        /* eslint-enable */

        const handleCopy = ({ target: { value } }) => {
          setInviteLink(value);
          setCopied(false);
        };

        const onCopy = () => {
          setCopied(true);
          toast.success(
            <>
              <CheckCircle className="mr-1 text-success" />
              Invite Link Copied!
            </>, {
              position: 'top-right',
              autoClose: 2000,
              hideProgressBar: true,
            }
          );
        };

        const handleDelete = async (recordObjId) => {
          // console.log('delete Store', storeObjId);
          try {
            await dispatch(updateSubgroup(`${recordObjId}`, { status: 'deleted' }));
            toast.success(
              <>
                <CheckCircle className="mr-1 text-success" />
                Record moved to trash
              </>, {
                hideProgressBar: true,
              }
            );
            // setModalVisibility(!modalVisibility);
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
                  onClick={() => setModalVisibilityInvite(!modalVisibilityInvite)}
                  className="w-100"
                >
                  <Link2 size={14} className="mr-50" />
                  <span className="align-middle">Invite Link</span>
                </DropdownItem> */}
                {/*
                <DropdownItem
                  tag={Link}
                  to={`/group/subgroups/invite/${row._id}`}
                  className="w-100"
                >
                  <Send size={14} className="mr-50" />
                  <span className="align-middle">Invite Customers</span>
                </DropdownItem> */}
                <DropdownItem
                  tag={Link}
                  to={`/group/subgroups/form/edit/${row._id}`}
                  className="w-100"
                  // onClick={() => store.dispatch(getStore(row._id))}
                >
                  <Archive size={14} className="mr-50" />
                  <span className="align-middle">Edit</span>
                </DropdownItem>
                <DropdownItem className="w-100" onClick={() => setModalVisibility(!modalVisibility)}>
                  <Trash2 size={14} className="mr-50" />
                  <span className="align-middle">Delete</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            {/* <Modal isOpen={modalVisibilityInvite} toggle={() => setModalVisibilityInvite(!modalVisibilityInvite)}>
              <ModalHeader toggle={() => setModalVisibilityInvite(!modalVisibilityInvite)}>Invite Link</ModalHeader>
              <ModalBody>
                { apiErrors.data ? (
                  <Alert color="danger">
                    <div className="alert-body">
                      <span>{`Error: ${apiErrors.data}`}</span>
                    </div>
                  </Alert>
                ) : <></>}
                Use the following url link to invite potential customers to
                {' '}
                {row.name}

                <div className="mt-2 d-flex w-100">
                  <Input value={inviteLink} onChange={handleCopy} className="w-100" />
                  <CopyToClipboard onCopy={onCopy} text={inviteLink}>
                    <Button.Ripple color="primary" outline>
                      <Copy size={14} />
                      Copy
                    </Button.Ripple>
                  </CopyToClipboard>
                </div>
              </ModalBody>
            </Modal> */}

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
                <div><strong>{row.name}</strong></div>
              </ModalBody>
              <ModalFooter className="justify-content-start">
                <Button color="primary" onClick={() => handleDelete(row._id)}>
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
