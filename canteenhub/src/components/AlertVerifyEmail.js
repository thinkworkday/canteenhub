/* eslint-disable no-alert */
import { useState } from 'react';
import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';

import {
  Alert, Button,
} from 'reactstrap';
import {
  AlertCircle,
} from 'react-feather';

// import medal from '@src/assets/images/illustration/badge.svg';

const AlertVerifyEmail = (props) => {
  const [visible, setVisible] = useState(!props.user.emailVerified);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationSending, setVerificationSending] = useState(false);

  const resendVerificationEmail = async (user) => {
    setVerificationSending(true);
    const data = JSON.stringify({
      userId: user._id,
    });
    await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/notifications/verifyEmail/`, data, {
      headers,
    })
      .then((response) => {
        setVerificationSending(false);
        setVerificationSent(true);
        // setEmailVerified(true);
      })
      .catch(() => {
        setVerificationSending(false);
        // setCode(false);
      });
    // setCodeChecked(true);
  };

  return (
    <Alert key={props.user._id} color="danger" className="alert-top" isOpen={visible}>
      <div className="alert-body d-flex justify-content-center align-items-center">
        <div>
          <AlertCircle size={15} />
          {' '}
          <span className="ml-1">
            Your email
            {' '}
            <strong>{props.user.email}</strong>
            {' '}
            is yet to be verified.
          </span>
        </div>
        <Button.Ripple color="flat-dark" onClick={() => resendVerificationEmail(props.user)} disabled={verificationSent}>
          { verificationSending ? <span>Sending...</span> : [(verificationSent ? <span>Sent!</span> : <span>Resend</span>)]}
        </Button.Ripple>
      </div>
    </Alert>
  );
};

export default AlertVerifyEmail;
