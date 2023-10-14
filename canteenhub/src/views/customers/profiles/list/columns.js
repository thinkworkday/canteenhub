// ** React Imports
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
// ** Custom Components
import moment from 'moment';

// ** Store & Actions
import { store } from '@store/storeConfig/store';
import { useDispatch } from 'react-redux';
import { updateProfile, getProfile } from '@store/actions/customer.actions';

// ** Third Party Components
import Avatar from '@components/avatar';
import {
  Alert, Badge, Button, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';

import {
  MoreVertical, CheckCircle, Trash2, Archive,
} from 'react-feather';
import { toast } from 'react-toastify';

const renderEmail = (row) => {
  const name = `${row.firstName} ${row.lastName}`;
  return (
    <Avatar color="success" content={name} initials />
  );
};

const renderAllergies = (row) => {
  if (row.allergies.length <= 0) {
    return (<span className="text-muted">nil</span>);
  }
  const allergies = row.allergies.map((allergy, i) => (
    <Badge key={i} color="light-danger" className="mr-1">
      {allergy}
    </Badge>
  ));

  return allergies;
};

const renderGroups = (row) => {
  // console.log(row);
  // const allergies = row.allergies.map((allergy, i) => (
  //   <Badge key={i} color="light-danger" className="mr-1">
  //     {allergy}
  //   </Badge>
  // ));

  const group = row.subgroups[0] && row.subgroups[0].group ? (
    <>
      <p className="m-0">{row.subgroups[0].group.companyName}</p>
      <small className="d-block text-muted">{row.subgroups[0].name}</small>
    </>
  ) : <p className="m-0 text-info">No school. Please assign.</p>;

  return group;
};

export const columns = (handleAddProfileSidebar, handleInitEdit) => {
  const history = useHistory();

  return [
    {
      name: '',
      width: '80px',
      cell: (row) => renderEmail(row),
      // selector: (row) => `${row.firstName} ${row.lastName}`,
      sortable: true,
    },
    {
      name: 'Name',
      selector: (row) => `${row.firstName} ${row.lastName}`,
      sortable: true,
    },
    {
      name: 'Alergies',
      cell: (row) => renderAllergies(row),
      sortable: true,
    },
    {
      name: 'School',
      selector: (row) => renderGroups(row),
      sortable: true,
    },
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
        const [apiErrors, setApiErrors] = useState({});
        const dispatch = useDispatch();

        const handleDelete = async (recordObjId) => {
          // console.log('delete Store', storeObjId);
          try {
            await dispatch(updateProfile(`${recordObjId}`, { status: 'deleted' }));
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
                <DropdownItem
                  // tag={Link}
                  // to={`/customer/profiles/form/edit/${row._id}`}
                  className="w-100"
                  onClick={() => handleInitEdit(row)}
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
