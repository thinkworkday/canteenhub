import React, { useState, useContext } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import classnames from 'classnames';
// import Avatar from '@components/avatar';
import useJwt from '@src/auth/jwt/useJwt';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
// import { toast, Zoom } from 'react-toastify';
import { handleLogin } from '@store/actions/auth';
import { AbilityContext } from '@src/utility/context/Can';
import { Link, useHistory } from 'react-router-dom';
import InputPasswordToggle from '@components/input-password-toggle';
import { getHomeRouteForLoggedInUser, isObjEmpty } from '@utils';

import themeConfig from '@configs/themeConfig';

// import {
//   CheckCircle,
// } from 'react-feather';
import {
  Alert, Card, CardBody, CardTitle, Form, Input, FormGroup, Label, CustomInput, Button, Spinner,
} from 'reactstrap';

import '@src/@core/scss/base/pages/page-auth.scss';

// console.log('localStorage', localStorage);

const Login = () => {
  const ability = useContext(AbilityContext);
  const dispatch = useDispatch();
  const history = useHistory();
  const [isProcessing, setProcessing] = useState(false);
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [remember, setRemember] = useState(false);
  const [apiErrors, setApiErrors] = useState({});

  const recaptchaRef = React.useRef();

  const { register, errors, handleSubmit } = useForm();

  // console.log(watch('example')); // watch input value by passing the name of it

  const onSubmit = async (data) => {
    setProcessing(true);

    const captchaToken = await recaptchaRef.current.executeAsync();
    recaptchaRef.current.reset();

    if (isObjEmpty(errors)) {
      useJwt
        .login({ ...data, instance: 'admin', captchaToken })
        .then((res) => {
          const loginData = { ...res.data.userData, accessToken: res.data.accessToken };
          dispatch(handleLogin(loginData));
          ability.update(loginData.ability);
          history.push(getHomeRouteForLoggedInUser(loginData.role));
        })
        .catch((err) => {
          setProcessing(false);
          setApiErrors(err.response ? err.response : { data: 'API connectivity error' });
          // eslint-disable-next-line no-console
          console.log('Error', err.response);
        });
    }
  };

  // console.log('apiErrors', apiErrors);

  function LoginError(loginProps) {
    const { error } = loginProps;
    if (error.data) {
      return (
        <Alert color="danger">
          <div className="alert-body">
            <span>{error.data}</span>
          </div>
        </Alert>
      );
    }
    return '';
  }

  return (
    <div className="auth-wrapper auth-v1 admin-auth-v1 px-2">
      <div className="auth-inner py-2">
        <h4 className="brand-logo">
          Admin Login
        </h4>
        <Card className="mb-0">
          <CardBody>
            <Form noValidate className="auth-login-form " onSubmit={handleSubmit(onSubmit)}>
              <ReCAPTCHA
                ref={recaptchaRef}
                size="invisible"
                sitekey={process.env.REACT_APP_GOOGLE_CAPTCHA_KEY}
              />

              <FormGroup>
                <Label className="form-label" for="login-email">
                  Email
                </Label>
                <Input
                  autoFocus
                  type="email"
                  // value={email}
                  id="email"
                  name="email"
                  placeholder=""
                  // onChange={(e) => setEmail(e.target.value)}
                  className={classnames({ 'is-invalid': errors.email })}
                  innerRef={register({ required: true, validate: (value) => value !== '' })}
                />
              </FormGroup>
              <FormGroup>
                <div className="d-flex justify-content-between">
                  <Label className="form-label" for="login-password">
                    Password
                  </Label>
                  <Link to="/forgot-password" className="forgot-password-link">
                    <small>Forgot Password?</small>
                  </Link>
                </div>
                <InputPasswordToggle
                  // value={password}
                  id="password"
                  name="password"
                  className="input-group-merge"
                  // onChange={(e) => setPassword(e.target.value)}
                  className={classnames({ 'is-invalid': errors.password })}
                  innerRef={register({ required: true, validate: (value) => value !== '' })}
                />
              </FormGroup>
              <LoginError error={apiErrors} />
              {/* <FormGroup>
                <CustomInput type="checkbox" className="custom-control-Primary" onChange={(e) => setRemember(e.target.checked)} id="remember-me" label="Remember Me" />
              </FormGroup> */}
              <Button.Ripple type="submit" color="primary" block>
                Sign in
                {isProcessing ?? (
                <Spinner
                  style={{ width: '1rem', height: '1rem' }}
                  type="grow"
                  color="light"
                />
                )}
              </Button.Ripple>

            </Form>
          </CardBody>
        </Card>

      </div>
    </div>
  );
};

export default Login;
