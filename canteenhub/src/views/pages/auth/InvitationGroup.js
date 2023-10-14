/* eslint-disable no-console */
/* eslint-disable no-return-assign */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux';
import { handleLogout } from '@store/actions/auth';

import { Inbox } from 'react-feather';

import Avatar from '@components/avatar';

import {
  Card, CardBody, CardTitle, Button,

} from 'reactstrap';
import '@styles/base/pages/page-auth.scss';

import themeConfig from '@configs/themeConfig';
import { getLoggedUser } from '@utils';
import { getInvite } from '@store/actions/invite.actions';
// import Spinner from '../../../components/FallbackSpinner';

// axios.defaults.withCredentials = true;
// const verifyEmail = async (code, setEmailVerified, setCodeChecked) => {
//   await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/auth/verifyEmail/${code}`)
//     .then(() => {
//       setEmailVerified(true);
//     })
//     .catch(() => {
//       // setCode(false);
//     });
//   setCodeChecked(true);
// };

const InvitationGroup = (req) => {
  // ** Store Vars
  const dispatch = useDispatch();
  const selectedInvite = useSelector((state) => state.invites.selectedInvite);
  const [inviteId] = useState(req.match.params.inviteId);
  const [emailExists, setEmailExists] = useState(false);
  const ctaUrl = emailExists ? '/login' : `/register-group/${inviteId}`;

  // console.log(inviteId);
  // const [emailVerified, setEmailVerified] = useState(false);

  const loggedUser = getLoggedUser();

  // console.log(inviteId);

  useEffect(() => {
    dispatch(getInvite(inviteId));
    // verifyEmail(code, setEmailVerified, setCodeChecked);
  }, [dispatch]);

  if (selectedInvite) {
    // check if already a user (by email)
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_SERVER_URL}/api/users/user/verifyEmail?email=${selectedInvite.toEmail}&role=${selectedInvite.toRole}`,
    })
      .then((response) => {
        setEmailExists(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="auth-wrapper auth-v1 px-2">
      <div className="auth-inner py-2">
        <div className="brand-logo">
          <img src={themeConfig.app.appLogoImage} alt="Canteen Hub" />
        </div>

        <Card className="mb-0">
          <CardBody>

            {loggedUser.email ? ( // if logged in

              <div className="text-center">
                <h6>
                  {loggedUser.role === 'group' ? (
                    <>
                      {' '}
                      You are already logged in as
                      {' '}
                      {loggedUser.email}
                    </>
                  ) : (
                    <>
                      {' '}
                      You are logged in, but not as a school.
                      <br />
                      Please Logout to continue.
                    </>
                  )}
                </h6>

                <div className="d-flex justify-content-center mt-2">
                  {loggedUser.role === 'group' ? (
                    <Button.Ripple tag={Link} to="/" className="btn-icon mr-1" color="primary">
                      Go to Dashboard
                    </Button.Ripple>
                  ) : (<></>)}
                  <Button.Ripple className="btn-icon" color="primary" tag={Link} to={`/invitation/${inviteId}`} onClick={() => dispatch(handleLogout())}>
                    Logout
                  </Button.Ripple>

                </div>

                {/* <DropdownItem tag={Link} to="/login" onClick={() => dispatch(handleLogout())}>
                  <Power size={14} className="mr-75" />
                  <span className="align-middle">Logout</span>
                </DropdownItem> */}
              </div>

            ) : (
              <div className="text-center">
                <Avatar color="success" size="lg" icon={<Inbox />} />
                <CardTitle tag="p" className="mt-1 mb-1">
                  {selectedInvite?.inviteFrom.companyName}
                  {' '}
                  has invited
                  {' '}
                  {selectedInvite?.toCompanyName}
                  {' '}
                  to connect
                </CardTitle>

                {emailExists ? (
                  <>
                    <p>
                      Login to Canteen Hub to accept the invitation and connect with
                      {' '}
                      {selectedInvite?.inviteFrom.companyName}
                    </p>
                    <a href={ctaUrl} className="btn btn-primary mt-2">Login</a>
                  </>
                ) : (
                  <>
                    <p>
                      Join Canteen Hub to accept the invitation and connect with
                      {' '}
                      {selectedInvite?.inviteFrom.companyName}
                    </p>
                    <a href={ctaUrl} className="btn btn-primary mt-2">Get Started</a>
                  </>
                )}

              </div>
            )}

            {/* {codeChecked ? (
            <CardBody>
              {emailVerified ? (
                <>
                  <div className="text-center">
                    <Avatar color="success" size="lg" icon={<CheckCircle />} />
                    <CardTitle tag="p" className="mt-1 mb-1">
                      Thanks! You&#39;re email has been verified
                    </CardTitle>
                    <a href="/dashboard" className="btn btn-primary mt-2">Go to Dashboard</a>
                  </div>
                </>
              ) : (
                <>
                  <Alert color="danger">
                    <div className="alert-body">
                      <span>Reset password link has expired or cannot be found</span>
                    </div>
                  </Alert>
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
          ) } */}
          </CardBody>
        </Card>

        {/* <p className="text-center mt-2">
          <Link to="/login">
            <ChevronLeft className="mr-25" size={14} />
            <span className="align-middle">Back to login</span>
          </Link>
        </p> */}
      </div>
    </div>
  );
};

export default InvitationGroup;
