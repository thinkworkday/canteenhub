/* eslint-disable react/jsx-key */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// ** Router Components

import { useForm } from 'react-hook-form';

import {
  Alert, Card, CardBody, FormGroup, Row, Col, Input, Form, Button, Label, Spinner, UncontrolledTooltip,
} from 'reactstrap';

// ** Utils
import { isObjEmpty } from '@utils';

// ** Store & Actions
import { updateMe } from '@store/actions/user.actions';

// ** Third Party Components
import classnames from 'classnames';
import Autocomplete from 'react-google-autocomplete';
import {
  HelpCircle, CheckCircle,
} from 'react-feather';
import { toast } from 'react-toastify';
import UILoader from '@components/ui-loader';

const AccountForm = ({ selectedRecord }) => {
  // ** Vars
  const dispatch = useDispatch();
  // const storedStoreUsers = useSelector((state) => state.users);

  const {
    register, errors, handleSubmit, setValue, clearErrors, control,
  } = useForm();
  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  const [addressObj, setAddressObj] = useState();
  const [address, setAddress] = useState();

  useEffect(() => {
    // set defaults
    const fields = ['companyName', 'firstName', 'lastName', 'email'];
    fields.forEach((field) => {
      setValue(field, selectedRecord[field]);
    });
    // Set the Google Autocomplete
    setAddress(selectedRecord.address[0].formattedAddress);
  }, []); // empty array will ensure its only run once

  const onSubmit = async (data) => {
    setProcessing(true);

    if (isObjEmpty(errors)) {
      try {
        await dispatch(updateMe(selectedRecord._id, data));
        toast.success(
          <>
            <CheckCircle className="mr-1 text-success" />
            Updated!
          </>
        );
        setProcessing(false);
      } catch (err) {
        setApiErrors(err.response ? err.response : { data: err.response.data });
        setProcessing(false);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      { apiErrors.data ? (
        <Alert color="danger">
          <div className="alert-body">
            <span>{`Error: ${apiErrors.data}`}</span>
          </div>
        </Alert>
      ) : <></>}

      <Row>
        <Col md="9" sm="12">
          <Card>
            <UILoader blocking={isProcessing}>
              <CardBody>
                {/* <p><strong>Store Details</strong></p> */}
                <Row>
                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label className="form-label" for="companyName">
                        School Name*
                      </Label>
                      <Input
                        type="text"
                        id="companyName"
                        name="companyName"
                        className={classnames({ 'is-invalid': errors.companyName })}
                        innerRef={register({ required: true })}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label className="form-label" for="address">
                        School Address
                      </Label>
                      <Autocomplete
                        defaultValue={address}
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

                  </Col>

                  <Col sm="12">
                    <FormGroup>
                      <Label className="form-label d-flex justify-content-between" for="email">
                        <span>
                          Email
                        </span>
                      </Label>
                      <Input
                        type="email"
                        name="email"
                        placeholder="jane@example.com"
                        className={classnames({ 'is-invalid': errors.email })}
                        innerRef={register({
                          pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: 'Email must be correctly formatted. Please check',
                          },
                        })}
                      />
                      {Object.keys(errors).length && errors.email ? (
                        <small className="text-danger mt-1">{errors.email.message}</small>
                      ) : null}
                      <small className="mt-2 text-muted">Be careful: By changing your email, you are also changing the login username for Canteen Hub</small>
                    </FormGroup>
                  </Col>

                </Row>
              </CardBody>
            </UILoader>

          </Card>
          <Card>
            <UILoader blocking={isProcessing}>
              <CardBody>
                {/* <p><strong>Store Details</strong></p> */}
                <Row>
                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label className="form-label" for="firstName">
                        Contact First Name
                      </Label>
                      <Input
                        type="text"
                        placeholder=""
                        id="firstName"
                        name="firstName"
                        className={classnames({ 'is-invalid': errors.firstName })}
                        innerRef={register({})}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">

                    <FormGroup>
                      <Label className="form-label" for="lastName">
                        Contact Last Name
                      </Label>
                      <Input
                        type="text"
                        placeholder=""
                        id="lastName"
                        name="lastName"
                        className={classnames({ 'is-invalid': errors.lastName })}
                        innerRef={register()}
                      />
                    </FormGroup>
                  </Col>

                </Row>
              </CardBody>
            </UILoader>

          </Card>
        </Col>

      </Row>

      <Row>
        <Col sm="12">
          <FormGroup className="d-flex">
            <Button.Ripple type="submit" className="mr-1 d-flex" color="primary" disabled={isProcessing}>
              {isProcessing && (
              <div className="d-flex align-items-center mr-1">
                <Spinner color="light" size="sm" />
              </div>
              )}
              <span>Update</span>
            </Button.Ripple>
            {/* <Button.Ripple outline color="flat-secondary" onClick={() => window.history.back()}>
              Back
            </Button.Ripple> */}
          </FormGroup>
        </Col>

      </Row>
    </Form>
  );
};
export default AccountForm;
