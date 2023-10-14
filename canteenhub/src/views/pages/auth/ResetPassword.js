/* eslint-disable no-return-assign */
import { useEffect, useState } from 'react';
import axios from 'axios';
import classnames from 'classnames';

import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { ChevronLeft } from 'react-feather';
import InputPasswordToggle from '@components/input-password-toggle';

import {
  Alert, Card, CardBody, CardTitle, CardText, Form, FormGroup, Label, Button,
} from 'reactstrap';
import '@styles/base/pages/page-auth.scss';

import themeConfig from '@configs/themeConfig';
// import Spinner from '../../../components/FallbackSpinner';

axios.defaults.withCredentials = true;
const checkAccessCode = async (code, setCode) => {
  await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/auth/accessCode/find/${code}`)
    .then(() => {})
    .catch(() => { setCode(false); });
};

const ResetPassword = (req) => {
  const { isAdmin } = req.match.params;
  const [code, setCode] = useState(req.match.params.code);
  const [apiErrors, setApiErrors] = useState({});
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const { register, errors, handleSubmit } = useForm();

  useEffect(() => {
    checkAccessCode(code, setCode); // this will fire only on first render
  }, [code, setCode]);

  const onSubmit = async () => {
    await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/resetPassword`, { password, code, isAdmin: !!isAdmin }).then(() => {
      window.location = `${process.env.REACT_APP_SITE_URL}/login?mode=password-reset`;
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      setApiErrors(err.response ? err.response : { data: 'API connectivity error' });
    });
  };

  return (
    <div className="auth-wrapper auth-v1 px-2">
      <div className="auth-inner py-2">
        <div className="brand-logo">
          <img src={themeConfig.app.appLogoImage} alt="Canteen Hub" />
        </div>

        <Card className="mb-0">
          <CardBody>
            {code ? (
              <>
                <CardTitle tag="h4" className="mb-1">
                  Reset
                  {' '}
                  {isAdmin ? 'Admin' : ''}
                  {' '}
                  Password
                </CardTitle>
                <CardText className="mb-2">Enter your new password below</CardText>
                <Form noValidate className="auth-reset-password-form mt-2" onSubmit={handleSubmit(onSubmit)}>
                  <FormGroup>
                    <Label className="form-label" for="password">
                      New Password
                    </Label>
                    <InputPasswordToggle
                      // value={password}
                      id="password"
                      name="password"
                      className="input-group-merge"
                      onChange={(e) => setPassword(e.target.value)}
                      className={classnames({ 'is-invalid': errors.password })}
                      innerRef={register({
                        required: 'You must specify a password',
                        minLength: {
                          value: 6,
                          message: 'Password must have at least 6 characters',
                        },
                      })}
                    />
                    {errors.password && <p className="text-danger">{errors.password.message}</p>}
                  </FormGroup>
                  <FormGroup>
                    <Label className="form-label" for="passwordConfirm">
                      Confirm Password
                    </Label>
                    <InputPasswordToggle
                      // value={passwordConfirm}
                      id="passwordConfirm"
                      name="passwordConfirm"
                      className="input-group-merge"
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      className={classnames({ 'is-invalid': errors.passwordConfirm })}
                      innerRef={register({
                        validate: (value) => value === password || 'The passwords do not match',
                      })}
                    />
                    {errors.passwordConfirm && <p className="text-danger">{errors.passwordConfirm.message}</p>}
                  </FormGroup>
                  { apiErrors.data ? (
                    <Alert color="danger">
                      <div className="alert-body">
                        <span>{apiErrors.data}</span>
                      </div>
                    </Alert>
                  ) : <></>}
                  <Button.Ripple type="submit" color="primary" block>
                    Set New Password
                  </Button.Ripple>
                </Form>
              </>
            ) : (
              <>
                <Alert color="danger">
                  <div className="alert-body">
                    <span>Reset password link has expired or cannot be found</span>
                  </div>
                </Alert>
                <Button.Ripple onClick={() => window.location.href = '/forgot-password'} color="primary" block>
                  Regenerate reset link
                </Button.Ripple>
              </>
            )}
            <p className="text-center mt-2">
              <Link to="/login">
                <ChevronLeft className="mr-25" size={14} />
                <span className="align-middle">Back to login</span>
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
