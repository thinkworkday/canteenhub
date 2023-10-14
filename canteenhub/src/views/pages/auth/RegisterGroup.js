/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import React, {
  Fragment, useRef, useState, useContext, useEffect,
} from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
// import axios from 'axios';
import useJwt from '@src/auth/jwt/useJwt';

import ReCAPTCHA from 'react-google-recaptcha';

import Autocomplete from 'react-google-autocomplete';

import { isObjEmpty } from '@utils';
import classnames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { handleLogin } from '@store/actions/auth';
import { getInvite } from '@store/actions/invite.actions';
import { AbilityContext } from '@src/utility/context/Can';
import InputPasswordToggle from '@components/input-password-toggle';

// import PlacesAutocomplete from '@src/components/AddressAutoComplete';
// import {
//   Facebook, Twitter, Mail, GitHub,
// } from 'react-feather';
import {
  Alert, Row, Col, CardTitle, FormGroup, Label, Button, Form, Input, CustomInput, Spinner,
} from 'reactstrap';

import themeConfig from '@configs/themeConfig';

import SchoolSVG from '@src/assets/images/illustrations/schoolHero';

import '@styles/base/pages/page-auth.scss';
// import { controllers } from 'chart.js';

const Register = () => {
  const recaptchaRef = React.useRef();

  const ability = useContext(AbilityContext);
  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  const [addressObj, setAddressObj] = useState();

  // const [skin, setSkin] = useSkin();
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    register, errors, setError, clearErrors, handleSubmit, watch, setValue,
  } = useForm();

  const selectedInvite = useSelector((state) => state.invites.selectedInvite);

  // has this registration come from an Invite?
  const { inviteId } = useParams();

  useEffect(() => {
    if (inviteId) {
      dispatch(getInvite(inviteId));
    }

    // if (selectedInvite) {
    //   setValue('firstName', selectedInvite.toFirstName);
    //   setValue('lastName', selectedInvite.toLastName);
    //   setValue('email', selectedInvite.toEmail);
    //   setValue('companyName', selectedInvite.toCompanyName);
    // }

    // verifyEmail(code, setEmailVerified, setCodeChecked);
  }, [dispatch, setValue, inviteId]);

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

  // console.log('errors', errors);

  const onSubmit = async (data) => {
    setProcessing(true);

    const captchaToken = await recaptchaRef.current.executeAsync();
    recaptchaRef.current.reset();

    // console.log('addressObj', addressObj);
    // console.log(addressObj?.length);

    // Check address is valid
    if (!addressObj) {
      errors.address = {};
      setError('address', {
        type: 'manual',
        message: 'Please select an address using the suggested option',
      });
    }

    if (isObjEmpty(errors)) {
      data.addressObj = addressObj; // group
      data.role = 'group'; // group  // set the user role
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
            console.log('res', res);

            const resData = { ...res.data.user, accessToken: res.data.accessToken };

            ability.update(res.data.user.ability);
            dispatch(handleLogin(resData));
            // history.push('/');
            history.push('/group/dashboard');
          }
        })
        .catch((err) => {
          setApiErrors(err.response ? err.response : { data: 'API connectivity error' });
          console.log(err);
        });
    }
  };

  if (selectedInvite) {
    // setValue('firstName', selectedInvite.toFirstName);
    // setValue('lastName', selectedInvite.toLastName);
    setValue('email', selectedInvite.toEmail);
    // setValue('companyName', selectedInvite.toCompanyName);
  }

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
              <SchoolSVG />
            </div>
          </Col>

          <Col className="flexbox-container align-items-start flex-column bg-white p-5 flexbox-responsive">
            <Col className=" mx-auto" xl="8">
              <small className="mb-1 text-uppercase text-gray-600">Join now, it&apos;s FREE</small>
              <CardTitle tag="h2" className=" font-weight-bold mb-1">
                Register Your School Here
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
                        Contact First Name
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
                        Contact Last name
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
                  <Label className="form-label" for="companyName">
                    School Name
                  </Label>
                  <Input
                    type="text"
                    placeholder="St Peters Primary School"
                    name="companyName"
                    className={classnames({ 'is-invalid': errors.companyName })}
                    innerRef={register({ required: true })}
                  />
                </FormGroup>

                <FormGroup>
                  <Label className="form-label" for="address">
                    School Address
                  </Label>
                  <Autocomplete
                    className={`form-control ${classnames({ 'is-invalid': errors.address })}`}
                    apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                    onChange={(e) => setAddressObj()}
                    onPlaceSelected={(place) => {
                      clearErrors('address');
                      setAddressObj(place);
                    }}
                    options={{
                      types: ['address'],
                      componentRestrictions: { country: 'au' },
                    }}
                  />
                  {Object.keys(errors).length && errors.address ? (
                    <small className="text-danger mt-1">{errors.address.message}</small>
                  ) : null}
                </FormGroup>

                <FormGroup>
                  <Label className="form-label" for="abn">
                    ABN
                  </Label>
                  <Input
                    type="text"
                    name="abn"
                    placeholder=""
                    className={classnames({ 'is-invalid': errors.abn })}
                    innerRef={register({
                      required: true,
                      pattern: {
                        value: /^(?:\d{11})$/,
                        message: 'Please enter a valid 11-digit ABN number',
                      },
                    })}
                  />
                  {Object.keys(errors).length && errors.abn ? (
                    <small className="text-danger mt-1">{errors.abn.message}</small>
                  ) : null}
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
                <Button.Ripple type="submit" block color="primary" className="mt-3">
                  Sign up

                  {isProcessing ?? (
                  <Spinner
                    style={{ width: '1rem', height: '1rem' }}
                    type="grow"
                    color="light"
                  />
                  )}
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
