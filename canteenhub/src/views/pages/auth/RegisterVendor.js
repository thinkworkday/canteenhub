/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import React, {
  Fragment, useRef, useState, useContext,
} from 'react';
import axios from 'axios';
import useJwt from '@src/auth/jwt/useJwt';

import ReCAPTCHA from 'react-google-recaptcha';

import { getHomeRouteForLoggedInUser, isObjEmpty } from '@utils';
import classnames from 'classnames';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { handleLogin } from '@store/actions/auth';
import { Link, useHistory } from 'react-router-dom';
import { AbilityContext } from '@src/utility/context/Can';
import InputPasswordToggle from '@components/input-password-toggle';

// import {
//   Facebook, Twitter, Mail, GitHub,
// } from 'react-feather';
import {
  Alert, Row, Col, CardTitle, CardText, FormGroup, Label, Button, Form, Input, CustomInput, Spinner,
} from 'reactstrap';

import themeConfig from '@configs/themeConfig';

import VendorSVG from '@src/assets/images/illustrations/vendorHero';

import '@styles/base/pages/page-auth.scss';

axios.defaults.withCredentials = true;
const Register = () => {
  const recaptchaRef = React.useRef();

  const ability = useContext(AbilityContext);
  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);
  const [block, setBlock] = useState(true);

  // const [skin, setSkin] = useSkin();
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    register, errors, handleSubmit, watch,
  } = useForm();

  const password = useRef({});
  password.current = watch('password', '');

  const [terms, setTerms] = useState(false);

  const Terms = () => (
    <>
      I agree to
      <a className="ml-25" href="/privacy" onClick={(e) => e.preventDefault()}>
        privacy policy & terms
      </a>
    </>
  );

  // console.log(errors);

  const onSubmit = async (data) => {
    setProcessing(true);

    const captchaToken = await recaptchaRef.current.executeAsync();
    recaptchaRef.current.reset();

    setApiErrors({});

    if (isObjEmpty(errors)) {
      // console.log(data);

      // set the user role
      data.role = 'vendor';
      data.status = 'pending';
      data.ability = [
        {
          action: 'manage',
          subject: 'all',
        },
      ];
      delete data.passwordConfirm;
      delete data.terms;

      useJwt
        .register({ ...data, captchaToken })
        .then((res) => {
          if (res.data.error) {
            const arr = {};
            for (const property in res.data.error) {
              if (res.data.error[property] !== null) arr[property] = res.data.error[property];
            }
            setApiErrors(arr);
            if (res.data.error.email !== null) console.error(res.data.error.email);
            if (res.data.error.username !== null) console.error(res.data.error.username);
          } else {
            setApiErrors({});
            const resData = { ...res.data.user, accessToken: res.data.accessToken };

            ability.update(res.data.user.ability);
            // console.log('res', resData);
            dispatch(handleLogin(resData));
            // history.push(getHomeRouteForLoggedInUser(resData.role));
            history.push('/');
          }
        })
        .catch((err) => {
          console.log(err);
          setApiErrors(err.response ? err.response : { data: 'API connectivity error' });
          setProcessing(false);
        });
    }
  };

  return (
    <div>
      <div className="auth-registration container-fluid h-100">
        <Row className="h-100">
          <Col className="flexbox-container flex-column justify-content-start align-items-start p-5 flexbox-page" lg="5" xl="4">

            <div className="brand-logo flex-column mb-5">
              <img src={themeConfig.app.appLogoImage} alt="Canteen Hub" className="mb-2" />
              <small className="brand-text pr-2">Canteen Hub is an online ordering platform for schools to easily connect with local fresh food suppliers.</small>
            </div>
            <div className="hero-image mt-2">
              <VendorSVG />
            </div>
          </Col>

          <Col className="flexbox-container align-items-start flex-column bg-white p-5 flexbox-responsive">

            <Col className=" mx-auto" xl="8">
              <small className="mb-1 text-uppercase text-gray-600">Join now, it&apos;s FREE</small>
              <CardTitle tag="h2" className=" font-weight-bold mb-1">
                Become a Canteen Hub vendor today
              </CardTitle>
              <Form noValidate action="/" className="auth-register-form mt-2" onSubmit={handleSubmit(onSubmit)}>

                { apiErrors.data ? (
                  <Alert color="danger">
                    <div className="alert-body">
                      <span>{apiErrors.data}</span>
                    </div>
                  </Alert>
                ) : <></>}

                <ReCAPTCHA
                  ref={recaptchaRef}
                  size="invisible"
                  sitekey={process.env.REACT_APP_GOOGLE_CAPTCHA_KEY}
                />

                <FormGroup>
                  <Row>
                    <Col>
                      <Label className="form-label" for="firstName">
                        Firstname
                      </Label>
                      <Input
                        type="text"
                        placeholder="Jane"
                        id="firstName"
                        name="firstName"
                        className={classnames({ 'is-invalid': errors.firstName })}
                        innerRef={register({ required: true })}
                      />
                    </Col>
                    <Col>
                      <Label className="form-label" for="lastName">
                        Last name
                      </Label>
                      <Input
                        type="text"
                        placeholder="Doe"
                        id="lastName"
                        name="lastName"
                        className={classnames({ 'is-invalid': errors.lastName })}
                        innerRef={register({ required: true })}
                      />
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Label className="form-label" for="email">
                    Email
                  </Label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="jane@example.com"
                    className={classnames({ 'is-invalid': errors.email })}
                    innerRef={register({
                      required: true,
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: 'Email must be correctly formatted. Please check',
                      },
                    })}
                  />
                  {Object.keys(errors).length && errors.email ? (
                    <small className="text-danger mt-1">{errors.email.message}</small>
                  ) : null}
                </FormGroup>
                <FormGroup>
                  <Label className="form-label" for="phoneNumber">
                    Phone No.
                  </Label>
                  <Input
                    type="text"
                    name="phoneNumber"
                    placeholder=""
                    className={classnames({ 'is-invalid': errors.phoneNumber })}
                    innerRef={register({
                      required: true,
                      pattern: {
                        value: /^(?:\+?61|0)[2-478](?:[ -]?[0-9]){8}$/,
                        message: 'Phone number must follow format 0404 123 214 or 03 9874 3777',
                      },
                    })}
                  />
                  {Object.keys(errors).length && errors.phoneNumber ? (
                    <small className="text-danger mt-1">{errors.phoneNumber.message}</small>
                  ) : null}
                </FormGroup>
                <FormGroup>

                  <Label className="form-label" for="companyName">
                    Company Name
                  </Label>
                  <Input
                    type="text"
                    placeholder="My Company Pty. Ltd."
                    name="companyName"
                    className={classnames({ 'is-invalid': errors.companyName })}
                    innerRef={register({ required: true })}
                  />

                </FormGroup>
                <FormGroup>
                  <Label className="form-label" for="password">
                    Password
                  </Label>
                  <InputPasswordToggle
                    name="password"
                    className={classnames({ 'is-invalid': errors.password })}
                    innerRef={register({
                      required: 'You must specify a password',
                      minLength: {
                        value: 6,
                        message: 'Password must have at least 6 characters',
                      },
                    })}
                  />
                  {errors.password && <small className="text-danger mt-1">{errors.password.message}</small>}
                </FormGroup>

                <FormGroup>
                  <Label className="form-label" for="passwordConfirm">
                    Confirm Password
                  </Label>
                  <InputPasswordToggle
                    id="passwordConfirm"
                    name="passwordConfirm"
                    className={classnames({ 'is-invalid': errors.passwordConfirm })}
                    innerRef={register({
                      validate: (value) => value === password.current || 'The passwords do not match',
                    })}
                  />
                  {errors.passwordConfirm && <small className="text-danger mt-1">{errors.passwordConfirm.message}</small>}
                </FormGroup>

                <FormGroup>

                  <CustomInput
                    type="checkbox"
                    id="terms"
                    name="terms"
                    value="terms"
                    label={<Terms />}
                    className="mt-2"
                    innerRef={register({ required: true })}
                    onChange={(e) => setTerms(e.target.checked)}
                    invalid={errors.terms && true}
                  />
                </FormGroup>

                <Button.Ripple type="submit" block color="primary" className="mt-3 d-flex w-100 justify-content-center" disabled={isProcessing}>
                  {isProcessing && (
                  <div className="d-flex align-items-center mr-1">
                    <Spinner color="light" size="sm" />
                  </div>
                  )}
                  <span>Register</span>
                </Button.Ripple>
              </Form>
              <p className="text-center mt-2">
                <span className="mr-25">Already have an account?</span>
                <Link to="/login">
                  <span>Sign in instead</span>
                </Link>
              </p>

            </Col>

          </Col>
        </Row>
      </div>

      <div className="auth-wrapper auth-registration d-none">

        <Row className="auth-inner m-0">

          <Col className="d-flex align-items-center auth-bg px-2 p-lg-5" lg="7" sm="12">
            <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="8">

              {/* <div className="divider my-2">
                <div className="divider-text">or</div>
              </div>
              <div className="auth-footer-btn d-flex justify-content-center">
                <Button.Ripple color="facebook">
                  <Facebook size={14} />
                </Button.Ripple>
                <Button.Ripple color="twitter">
                  <Twitter size={14} />
                </Button.Ripple>
                <Button.Ripple color="google">
                  <Mail size={14} />
                </Button.Ripple>
                <Button.Ripple className="mr-0" color="github">
                  <GitHub size={14} />
                </Button.Ripple>
              </div> */}
            </Col>
          </Col>

        </Row>
      </div>
    </div>
  );
};

export default Register;
