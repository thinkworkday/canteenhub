import React, { useState } from 'react';
import axios from 'axios';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  ChevronLeft,
  Send,
} from 'react-feather';
import Avatar from '@components/avatar';
import {
  Alert, Card, CardBody, CardTitle, CardText, Form, FormGroup, Input, Button,
} from 'reactstrap';
import '@styles/base/pages/page-auth.scss';

import themeConfig from '@configs/themeConfig';

axios.defaults.withCredentials = true;
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [apiErrors, setApiErrors] = useState({});
  const { register, errors, handleSubmit } = useForm();

  const onSubmit = async () => {
    setApiErrors({});

    await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/forgotPassword`, { email }).then(() => {
      window.location = `${document.location.toString()}?mode=password-reset`;
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
          <img src={themeConfig.app.appLogoImage} alt="logo" />
        </div>
        <Card className="mb-0">
          <CardBody>
            {
            window.location.href.includes('mode=password-reset') ? (
              <div className="text-center">
                <Avatar color="success" size="lg" icon={<Send />} />
                <CardTitle tag="p" className="mt-1 mb-1">
                  Reset password email sent!
                </CardTitle>
                <p>
                  Follow the instructions in the email to reset your password
                </p>
              </div>
            ) : (
              <>
                <CardTitle tag="h4" className="mb-1">
                  Reset Password
                </CardTitle>
                <CardText className="mb-2">
                  Enter your email and we will send you instructions to reset your password
                </CardText>
                <Form noValidate className="auth-forgot-password-form mt-2" onSubmit={handleSubmit(onSubmit)}>
                  <FormGroup>
                    <Input
                      autoFocus
                      type="email"
                      value={email}
                      id="email"
                      name="email"
                      placeholder=""
                      onChange={(e) => setEmail(e.target.value)}
                      className={classnames({ 'is-invalid': errors.email })}
                      innerRef={register({ required: true })}
                    />
                  </FormGroup>
                  { apiErrors.data ? (
                    <Alert color="danger">
                      <div className="alert-body">
                        <span>{apiErrors.data}</span>
                      </div>
                    </Alert>
                  ) : <></>}
                  <Button.Ripple type="submit" color="primary" block>
                    Send reset link
                  </Button.Ripple>
                </Form>
                <p className="text-center mt-2">
                  <Link to="/login">
                    <ChevronLeft className="mr-25" size={14} />
                    <span className="align-middle">Back to login</span>
                  </Link>
                </p>
              </>
            )
            }
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
