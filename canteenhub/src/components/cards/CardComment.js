// ** React Imports
import { useState } from 'react';

// ** Store & Actions

import { CheckCircle } from 'react-feather';
// import classnames from 'classnames';
import { getCutOffDate, getLoggedUser } from '@utils';

//* * Components
import {
  Media,
  Button,
} from 'reactstrap';
import Avatar from '@components/avatar';
import { DisplayStatus } from '@src/components/DisplayStatus';
import { ModalOrderNotesResponse } from '@src/components/modals/ModalOrderNotesResponse';

const CardComments = ({
  comment, index,
}) => {
  if (!comment) {
    return false;
  }

  const loggedUser = getLoggedUser();

  const { replies } = comment;

  // ** States
  const [modalConfirmVisibility, setModalConfirmVisibility] = useState(false);
  const [reviewStatus, setReviewStatus] = useState();
  const [noteParent, setNoteParent] = useState();
  const toggleReviewModal = () => {
    setModalConfirmVisibility(!modalConfirmVisibility);
  };

  return (
    <div
      key={index}
      tabIndex={index}
      className="comment-row d-flex"
    >
      <Media className="d-flex justify-content-between align-items-top w-100">

        <div className="mr-1">
          <Avatar color="light-success" content={`${comment.createdBy.firstName} ${comment.createdBy.lastName}`} initials />
        </div>

        <div className="comment-wrapper ">
          <p className="mb-0">
            <small className="d-block">
              {`${comment.createdBy.firstName} ${comment.createdBy.lastName}`}

              <span className="text-muted">
                {' '}
                {getCutOffDate(comment.createdAt, 0, true)}
              </span>
            </small>
            {comment.name}
            {' '}
            {comment.notes}
          </p>

          { replies.map((reply, i) => (
            <Media key={i} className="reply-wrapper d-flex justify-content-start align-items-top w-100">

              <div className="mr-1">
                <Avatar color="light-secondary" content={`${reply.createdBy.firstName} ${reply.createdBy.lastName}`} initials />
              </div>
              <div className="comment-wrapper ">
                <p className="mb-0">
                  <small className="d-block">
                    {reply.status}
                    {' '}
                    by
                    {' '}
                    {`${reply.createdBy.firstName} ${reply.createdBy.lastName}`}
                    <span className="text-muted">
                      {' '}
                      {getCutOffDate(reply.createdAt, 0, true)}
                    </span>
                  </small>
                  {reply.name}
                  {' '}
                  {reply.notes}
                </p>
              </div>

            </Media>
          ))}
        </div>

        <div className="ml-auto">

          {replies.length === 0 && (loggedUser.role === 'admin' || loggedUser.role === 'group' || loggedUser.role === 'vendor' || loggedUser.role === 'store') ? (
            <div className="actionButtons ">
              <Button.Ripple
                size="sm"
                color="aero"
                className="mr-1"
                onClick={() => { setNoteParent(comment._id); setReviewStatus('approved'); toggleReviewModal(); }}
              >
                Approve
              </Button.Ripple>
              <Button.Ripple
                size="sm"
                color="danger"
                outline
                onClick={() => { setNoteParent(comment._id); setReviewStatus('declined'); toggleReviewModal(); }}
              >
                Decline
              </Button.Ripple>
            </div>
          ) : <DisplayStatus status={comment.status} /> }

        </div>

      </Media>
      <CheckCircle size={32} className="check-notificaiton d-none" />

      <ModalOrderNotesResponse orderId={comment.order} noteParent={noteParent} status={reviewStatus} modalConfirmVisibility={modalConfirmVisibility} setModalConfirmVisibility={setModalConfirmVisibility} />

    </div>
  );
};

export default CardComments;
