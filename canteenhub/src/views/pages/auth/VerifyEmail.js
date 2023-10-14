/* eslint-disable no-return-assign */
import { useEffect, useState } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';

import { ChevronLeft, Send, CheckCircle } from 'react-feather';

import Avatar from '@components/avatar';

import {
  Alert, Card, CardBody, CardTitle,
} from 'reactstrap';
import '@styles/base/pages/page-auth.scss';

import themeConfig from '@configs/themeConfig';
import Spinner from '../../../components/FallbackSpinner';

axios.defaults.withCredentials = true;
const verifyEmail = async (code, setEmailVerified, setCodeChecked) => {
  await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/auth/verifyEmail/${code}`)
    .then(() => {
      setEmailVerified(true);
    })
    .catch(() => {
      // setCode(false);
    });
  setCodeChecked(true);
};

const VerifyEmail = (req) => {
  const [codeChecked, setCodeChecked] = useState(false);
  const [code] = useState(req.match.params.code);
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    verifyEmail(code, setEmailVerified, setCodeChecked);
  }, [code, setEmailVerified, setCodeChecked]);

  return (
    <div className="auth-wrapper auth-v1 px-2">
      <div className="auth-inner py-2">
        <div className="brand-logo">
          <img src={themeConfig.app.appLogoImage} alt="Canteen Hub" />
        </div>

        <Card className="mb-0">
          {codeChecked ? (
            <CardBody>
              {emailVerified ? (
                <>
                  <div className="text-center">
                    <Avatar color="success" size="lg" icon={<CheckCircle />} />
                    <CardTitle tag="p" className="mt-1 mb-1">
                      Thanks! You&#39;re email has been verified
                    </CardTitle>
                    <a href="/login" className="btn btn-primary mt-2">Go to Dashboard</a>
                  </div>
                </>
              ) : (
                <>
                  <Alert color="danger">
                    <div className="alert-body">
                      <span>Reset password link has expired or cannot be found</span>
                    </div>
                  </Alert>
                  {/* <Button.Ripple onClick={() => window.location.href = '/forgot-password'} color="primary" block>
                    Regenerate reset link
                  </Button.Ripple> */}
                </>
              )}

            </CardBody>

          ) : (
            <>
              <Alert color="danger">
                <div className="alert-body">
                  <span>Error checking access code</span>
                </div>
              </Alert>
            </>
          ) }

        </Card>

        <p className="text-center mt-2">
          <Link to="/login">
            <ChevronLeft className="mr-25" size={14} />
            <span className="align-middle">Back to login</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
