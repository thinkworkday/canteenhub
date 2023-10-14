// ** React Imports
import { useState } from 'react';
import { Link } from 'react-router-dom';
// ** Custom Components
import { DisplayStatus } from '@src/components/DisplayStatus';

// ** Store & Actions
import { store } from '@store/storeConfig/store';
import { useDispatch } from 'react-redux';

// ** Third Party Components
import {
  Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';

import {
  MoreVertical, CheckCircle, Calendar,
} from 'react-feather';
import { toast } from 'react-toastify';
import { updateStore } from '@store/actions/vendor.actions';
import { fetchEvent } from '@store/actions/event.actions';

import { getDeliveryDate, getCutOffDate } from '@utils';

export const columns = () => [
  {
    name: 'Event Date',
    sortable: true,
    minWidth: '250px',
    cell: (row) => <Link onClick={() => store.dispatch(fetchEvent(row._id))} to={`/group/order-dates/view/${row._id}`}>{`${getDeliveryDate(row.date, row.deliveryTime)}`}</Link>,
  },
  {
    name: 'Cutoff',
    selector: (row) => getCutOffDate(getDeliveryDate(row.date, row.deliveryTime), row.cutoffPeriod, true),
    sortable: true,
  },
  {
    name: 'Event Title',
    selector: (row) => `${row.title}`,
    sortable: true,
  },
  {
    name: 'Store',
    selector: (row) => (
      <div>
        {row.store?.storeName}
      </div>
    ),
    sortable: true,
  },
  {
    name: 'Status',
    selector: (row) => <DisplayStatus status={row.status} />,
    sortable: true,
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
                to={`/group/order-dates/view/${row._id}`}
                className="w-100"
                onClick={() => store.dispatch(fetchEvent(row._id))}
              >
                <Calendar size={14} className="mr-50" />
                <span className="align-middle">View details</span>
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
