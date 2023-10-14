/* eslint-disable react/jsx-key */
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// ** Router Components
import { useForm } from 'react-hook-form';

// ** Components
import Repeater from '@components/repeater';
import {
  Alert, Card, CardHeader, CardBody, FormGroup, Row, Col, Input, Form, Button, Label, Spinner, UncontrolledTooltip, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';

import CardProfileAssignGroup from '@src/components/cards/CardProfileAssignGroup';

// ** Utils
import { isObjEmpty, getLoggedUser } from '@utils';

// ** Store & Actions
import { addProfile, updateProfile } from '@store/actions/customer.actions';

// ** Third Party Components
import classnames from 'classnames';
import {
  HelpCircle, CheckCircle,
  X, Plus,
} from 'react-feather';
import { toast } from 'react-toastify';
import UILoader from '@components/ui-loader';

const AccountForm = ({ mode, selectedRecord }) => {
  // ** Vars
  const dispatch = useDispatch();

  const {
    register, errors, handleSubmit, setValue,
  } = useForm();
  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  const [allergyCount, setAllergyCount] = useState(selectedRecord && selectedRecord.allergies ? selectedRecord.allergies.length : 1);

  const increaseAllergyCount = () => {
    setAllergyCount(allergyCount + 1);
  };

  const deleteForm = (e) => {
    e.preventDefault();
    const rowElement = e.target.closest('.repeater-allergy-row');
    const inputELements = rowElement.querySelectorAll('input');
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < inputELements.length; i++) {
      inputELements[i].value = '';
    }
    e.target.closest('.repeater-allergy-row').remove();
  };

  useEffect(() => {
    // set defaults
    if (mode === 'edit') {
      const fields = ['firstName', 'lastName', 'notes', 'allergies'];
      fields.forEach((field) => {
        setValue(field, selectedRecord[field]);
      });
    }
  }, [selectedRecord]); // empty array will ensure its only run once

  const onSubmit = async (data) => {
    // setProcessing(true);

    if (isObjEmpty(errors)) {
      // set vendor to current user (logged in as vendor) - if admin then need to manually specify
      const currentCustomer = getLoggedUser();
      data.customer = currentCustomer._id;

      try {
        if (mode === 'edit') {
          await dispatch(updateProfile(selectedRecord._id, data));
        } else {
          await dispatch(addProfile(data));
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
        window.location = `${process.env.REACT_APP_SITE_URL}/customer/profiles`;
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
        <Col md="8" sm="12">
          <Card>
            <UILoader blocking={isProcessing}>
              <CardBody>
                {/* <p><strong>Store Details</strong></p> */}
                <Row>
                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label className="form-label" for="firstName">
                        First Name*
                      </Label>
                      <Input
                        type="text"
                        placeholder=""
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
                        Last Name*
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
                <Row>
                  <Col sm="12">
                    <FormGroup>
                      <Label className="form-label" for="notes">
                        <span>Notes </span>
                        <HelpCircle id="tipStoreEmail" size="18px" />
                        <UncontrolledTooltip placement="top" target="tipStoreEmail">
                          Please provide any notes that you would like to be send on all orders for this profile
                        </UncontrolledTooltip>
                      </Label>
                      <Input
                        type="textarea"
                        placeholder=""
                        id="notes"
                        name="notes"
                        className={classnames({ 'is-invalid': errors.notes })}
                        innerRef={register()}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </UILoader>

          </Card>
        </Col>

        <Col md="4" sm="12">

          <CardProfileAssignGroup profile={selectedRecord} />

          <Card>
            <CardHeader>
              <h4 className="card-title">Allergies</h4>
              <HelpCircle id="tipAllergies" size="18px" />
              <UncontrolledTooltip placement="top" target="tipAllergies">
                Please provide all allergies. They will be sent to the store provider on every order.
              </UncontrolledTooltip>
            </CardHeader>
            <CardBody>
              <Repeater className="mt-1" count={allergyCount}>
                {(i) => (
                  <div className="repeater-allergy-row" key={i}>
                    <Row className="justify-content-between align-items-top">
                      <Col md={10}>
                        <FormGroup>
                          <Input type="text" id={`allergies-${i}`} name={`allergies[${i}]`} placeholder="Enter allergy" innerRef={register()} />
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <Button.Ripple size="sm" color="danger" className="text-nowrap " onClick={deleteForm} outline>
                          <X size={14} />
                        </Button.Ripple>
                      </Col>
                      <Col sm={12}>
                        <hr className="mt-0" />
                      </Col>
                    </Row>
                  </div>
                )}
              </Repeater>
              <Button.Ripple size="xs" className="btn-icon" color="danger" outline onClick={increaseAllergyCount}>
                <Plus size={14} />
                <span className="align-middle ml-25">Add Allergy</span>
              </Button.Ripple>
            </CardBody>
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
