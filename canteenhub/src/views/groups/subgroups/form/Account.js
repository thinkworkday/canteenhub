/* eslint-disable react/jsx-key */
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// ** Router Components

import { useForm } from 'react-hook-form';

import {
  Alert, Card, CardBody, FormGroup, Row, Col, Input, Form, Button, Label, Spinner, UncontrolledTooltip,
} from 'reactstrap';

// ** Utils
import { isObjEmpty, getLoggedUser } from '@utils';

// ** Store & Actions
import { addSubgroup, updateSubgroup } from '@store/actions/group.actions';

// ** Third Party Components
import classnames from 'classnames';
import {
  HelpCircle, CheckCircle,
} from 'react-feather';
import { toast } from 'react-toastify';
import UILoader from '@components/ui-loader';

const AccountForm = ({ mode, selectedRecord }) => {
  // ** Vars
  const dispatch = useDispatch();
  // const storedStoreUsers = useSelector((state) => state.users);

  const {
    register, errors, handleSubmit, setValue, clearErrors, control,
  } = useForm();
  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  useEffect(() => {
    // set defaults
    if (mode === 'edit') {
      const fields = ['name', 'description', 'contactFirstName', 'contactLastName', 'contactEmail'];
      fields.forEach((field) => {
        setValue(field, selectedRecord[field]);
      });
    }
  }, []); // empty array will ensure its only run once

  const onSubmit = async (data) => {
    setProcessing(true);

    if (isObjEmpty(errors)) {
      // set vendor to current user (logged in as vendor) - if admin then need to manually specify
      const currentGroup = getLoggedUser();
      data.group = currentGroup._id;
      data.type = 'classroom';

      try {
        if (mode === 'edit') {
          await dispatch(updateSubgroup(selectedRecord._id, data));
        } else {
          await dispatch(addSubgroup(data));
        }

        toast.success(
          <>
            <CheckCircle className="mr-1 text-success" />
            Record
            {' '}
            {mode === 'edit' ? 'modified' : 'added'}
          </>, {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: true,
          }
        );

        // redirect back to List view
        window.location = `${process.env.REACT_APP_SITE_URL}/group/subgroups`;
        setProcessing(false);
      } catch (err) {
        if (err.response && err.response.status === 500) {
          setApiErrors({ data: 'Could not upload image. File format error' });
        } else {
          setApiErrors(err.response ? err.response : { data: err.response.data });
        }
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
                      <Label className="form-label" for="name">
                        Classroom Name*
                      </Label>
                      <Input
                        type="text"
                        placeholder="e.g. Grade 2A"
                        id="name"
                        name="name"
                        className={classnames({ 'is-invalid': errors.name })}
                        innerRef={register({ required: true })}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">

                    <FormGroup>
                      <Label className="form-label" for="description">
                        Classroom Description
                      </Label>
                      <Input
                        type="textarea"
                        placeholder=""
                        id="description"
                        name="description"
                        className={classnames({ 'is-invalid': errors.description })}
                        innerRef={register()}
                      />
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
                      <Label className="form-label" for="contactFirstName">
                        Contact First Name
                      </Label>
                      <Input
                        type="text"
                        placeholder=""
                        id="contactFirstName"
                        name="contactFirstName"
                        className={classnames({ 'is-invalid': errors.contactFirstName })}
                        innerRef={register({})}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">

                    <FormGroup>
                      <Label className="form-label" for="contactLastName">
                        Contact Last Name
                      </Label>
                      <Input
                        type="text"
                        placeholder=""
                        id="contactLastName"
                        name="contactLastName"
                        className={classnames({ 'is-invalid': errors.contactLastName })}
                        innerRef={register()}
                      />
                    </FormGroup>
                  </Col>

                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label className="form-label d-flex justify-content-between" for="contactEmail">
                        <span>Contact Email</span>
                        <HelpCircle id="tipStoreEmail" size="18px" />
                        <UncontrolledTooltip placement="top" target="tipStoreEmail">
                          Used for order correspondance and reporting
                        </UncontrolledTooltip>
                      </Label>
                      <Input
                        type="email"
                        name="contactEmail"
                        placeholder="jane@example.com"
                        className={classnames({ 'is-invalid': errors.contactEmail })}
                        innerRef={register({
                          pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: 'Email must be correctly formatted. Please check',
                          },
                        })}
                      />
                      {Object.keys(errors).length && errors.contactEmail ? (
                        <small className="text-danger mt-1">{errors.contactEmail.message}</small>
                      ) : null}
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
