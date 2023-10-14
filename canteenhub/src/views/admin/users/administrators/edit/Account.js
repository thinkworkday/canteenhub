import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import {
  Alert, Card, CardBody, FormGroup, Row, Col, Input, Form, Button, Label, Spinner,
} from 'reactstrap';
import InputPasswordToggle from '@components/input-password-toggle';

// ** Utils
import { isObjEmpty } from '@utils';

// ** Third Party Components
import classnames from 'classnames';
import {
  CheckCircle,
} from 'react-feather';
import { toast } from 'react-toastify';

// ** Store & Actions
import { useDispatch } from 'react-redux';
import { updateAdmin } from '@store/actions/user.actions';

const AccountForm = ({ selectedUser }) => {
  // ** Vars
  const dispatch = useDispatch();
  const {
    register, errors, handleSubmit, setValue,
  } = useForm();
  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  useEffect(() => {
    // set defaults
    const fields = ['firstName', 'lastName', 'email'];
    fields.forEach((field) => setValue(field, selectedUser[field]));
  }, [selectedUser]);

  const onSubmit = async (values) => {
    // console.log(values);
    setProcessing(true);

    if (isObjEmpty(errors)) {
      try {
        await dispatch(updateAdmin(selectedUser._id, values));
        toast.success(
          <>
            <CheckCircle className="mr-1 text-success" />
            Record updated
          </>, {
            position: 'bottom-right',
            autoClose: 2000,
            hideProgressBar: true,
          }
        );
        // toggleSidebar();
      } catch (err) {
        setApiErrors(err.response ? err.response : { data: err.response.data });
      }

      setProcessing(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        {/* <CardHeader>
      <CardTitle tag="h4">Multiple Column</CardTitle>
    </CardHeader> */}

        <CardBody>

          { apiErrors.data ? (
            <Alert color="danger">
              <div className="alert-body">
                <span>{`Error: ${apiErrors.data}`}</span>
              </div>
            </Alert>
          ) : <></>}

          <Row>
            <Col md="6" sm="12">
              <FormGroup>
                <Label className="form-label" for="firstName">
                  First name
                </Label>
                <Input
                  type="text"
                  placeholder="Jane"
                  id="firstName"
                  name="firstName"
                  className={classnames({ 'is-invalid': errors.firstName })}
                  innerRef={register({ required: true })}
                />
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
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
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label className="form-label" for="email">
                  Email
                </Label>
                <Input
                  type="email"
                  name="email"
                  disabled
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
            </Col>

            <Col md="6" sm="12">
              <FormGroup>
                <Label className="form-label" for="password">
                  Password
                </Label>
                <InputPasswordToggle
                  name="password"
                  className={classnames({ 'is-invalid': errors.password })}
                  innerRef={register({
                    minLength: {
                      value: 6,
                      message: 'Password must have at least 6 characters',
                    },
                  })}
                />
                {errors.password && <small className="text-danger mt-1">{errors.password.message}</small>}

                <small className="d-block mt-1 text-danger">NOTE: Enter new password to update, leave blank to keep as is. For security purposes, you will be required to communicate the password to the new administrator</small>
              </FormGroup>
            </Col>

          </Row>
        </CardBody>
      </Card>

      <Row>
        <Col sm="12">
          <FormGroup className="d-flex">
            <Button.Ripple type="submit" className="mr-1 d-flex" color="primary" disabled={isProcessing}>
              {isProcessing && (
              <div className="d-flex align-items-center mr-1">
                <Spinner color="light" size="sm" />
              </div>
              )}
              <span>Submit</span>
            </Button.Ripple>
            <Button.Ripple outline color="flat-secondary" onClick={() => window.history.back()}>
              Back
            </Button.Ripple>
          </FormGroup>
        </Col>

      </Row>
    </Form>
  );
};
export default AccountForm;
