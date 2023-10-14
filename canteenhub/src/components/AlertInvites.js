import { useEffect, useState } from 'react';

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux';

import moment from 'moment';

import {
  Alert, Button, Card, CardBody, CardText, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import Avatar from '@components/avatar';

import { toast } from 'react-toastify';
import { XCircle, Inbox, CheckCircle } from 'react-feather';
import UILoader from '@components/ui-loader';

import { getInvitesReceived, acceptInvite, declineInvite } from '@store/actions/invite.actions';

const AlertInvites = () => {
  const dispatch = useDispatch();
  const pendingInvites = useSelector((state) => state.invites);

  // modal fields
  const [modalBlocked, setModalBlocked] = useState(false);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [modalInvite, setModalInvite] = useState({});

  const [apiErrors, setApiErrors] = useState({});

  // ** Get data on mount
  useEffect(() => {
    dispatch(getInvitesReceived('pending'));
  }, [dispatch, getInvitesReceived]);

  const openInviteModal = (invite) => {
    setModalInvite(invite);
    setModalVisibility(true);
  };

  const handleAcceptInvite = async (invite) => {
    try {
      setModalBlocked(true);
      await dispatch(acceptInvite(invite._id));
      await dispatch(getInvitesReceived('pending'));
      setModalVisibility(false);
      toast.success(
        <>
          <CheckCircle className="mr-1 text-success" />
          Invite accepted
        </>, {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: true,
        }
      );
      setModalBlocked(false);
    } catch (err) {
      setApiErrors(err.response ? err.response : { data: err.response.data });
      setModalBlocked(false);
    }
  };

  const handleDeclineInvite = async (invite) => {
    try {
      setModalBlocked(true);
      await dispatch(declineInvite(invite._id));
      await dispatch(getInvitesReceived('pending'));
      setModalVisibility(false);
      toast.success(
        <>
          <XCircle className="mr-1 text-danger" />
          Invite declined
        </>, {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: true,
        }
      );
      setModalBlocked(false);
    } catch (err) {
      setApiErrors(err.response ? err.response : { data: err.response.data });
      setModalBlocked(false);
    }
  };

  return (
    <>

      {pendingInvites.data.map((invite) => (
        <Card key={invite._id} className="card-approve-cta">
          <CardBody className="d-flex justify-content-lg-between align-items-center">
            <div className="card-icon">
              <Avatar color="success" icon={<Inbox />} />
            </div>
            <div>
              <h6 className="mb-0">
                Invitation from
                {' '}
                {invite.inviteFrom.companyName}
              </h6>
              <CardText>
                <small>
                  {moment(invite.createdDate).fromNow()}
                </small>
              </CardText>
            </div>
            <Button.Ripple color="primary" className="ml-auto  " onClick={() => openInviteModal(invite)}>View</Button.Ripple>
          </CardBody>
        </Card>
      ))}

      {modalInvite._id ? (

        <Modal isOpen={modalVisibility} toggle={() => setModalVisibility(!modalVisibility)}>
          <UILoader blocking={modalBlocked}>
            <ModalHeader toggle={() => setModalVisibility(!modalVisibility)}>Accept Invitation?</ModalHeader>

            <ModalBody className="">

              { apiErrors.data ? (
                <Alert color="danger">
                  <div className="alert-body">
                    <span>{`Error: ${apiErrors.data}`}</span>
                  </div>
                </Alert>
              ) : <></>}

              <div className="d-flex justify-content-center">
                <div className="card-icon">
                  <Avatar color="success" size="xl" icon={<Inbox />} />
                </div>
              </div>

              <Card className="card-approve-cta">
                <CardBody className="d-flex justify-content-lg-between align-items-center">

                  <div>
                    <h6 className="mb-0">
                      Invitation from
                      {' '}
                      {modalInvite.inviteFrom.companyName}
                    </h6>
                    <CardText>
                      <small>
                        Received
                        {' '}
                        {moment(modalInvite.createdDate).fromNow()}
                      </small>
                    </CardText>
                  </div>
                </CardBody>
              </Card>

            </ModalBody>

            <ModalFooter className="justify-content-center">
              <Button color="primary" onClick={() => handleAcceptInvite(modalInvite)}>
                Yes, Please Accept
              </Button>
              <Button color="secondary" onClick={() => handleDeclineInvite(modalInvite)} outline>
                Decline
              </Button>
            </ModalFooter>
          </UILoader>
        </Modal>

      ) : <></> }

    </>
  );
};

export default AlertInvites;
