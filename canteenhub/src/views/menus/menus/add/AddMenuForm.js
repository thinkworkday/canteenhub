/* eslint-disable react/jsx-key */
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// ** Router Components

import { useForm } from 'react-hook-form';

import {
  Alert, Card, CardBody, FormGroup, Row, Col, Input, Form, Button, Label, Spinner,
} from 'reactstrap';

// ** Utils
import { isObjEmpty } from '@utils';

// ** Store & Actions
import { addMenu, updateMenu } from '@store/actions/menu.actions';

// ** Third Party Components
import classnames from 'classnames';
import {
  HelpCircle, CheckCircle,
} from 'react-feather';
import { toast } from 'react-toastify';
import UILoader from '@components/ui-loader';

const AddMenuForm = ({ selectedRecord }) => {
  // ** Vars
  const dispatch = useDispatch();
  // const storedStoreUsers = useSelector((state) => state.users);

  const {
    register, errors, handleSubmit, setValue, clearErrors, control,
  } = useForm();
  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  // useEffect(() => {
  //   // set defaults
  //   if (mode === 'edit') {
  //     const fields = ['name', 'description'];
  //     fields.forEach((field) => {
  //       setValue(field, selectedRecord[field]);
  //     });
  //   }
  // }, []); // empty array will ensure its only run once

  const onSubmit = async (data) => {
    setProcessing(true);
    if (isObjEmpty(errors)) {
      // set vendor to current user (logged in as vendor) - if admin then need to manually specify
      try {
        await dispatch(addMenu(data));

        toast.success(
          <>
            <CheckCircle className="mr-1 text-success" />
            Menu created
          </>,
        );

        // redirect back to List view
        window.location = `${process.env.REACT_APP_SITE_URL}/admin/menus/list`;
        setProcessing(false);
      } catch (err) {
        if (err.response && err.response.status === 500) {
          setApiErrors({ data: 'Could not upload image. File format error' });
        } else {
          // setApiErrors(err.response ? err.response : { data: err.response.data });
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
                        Name*
                      </Label>
                      <Input
                        type="text"
                        placeholder="e.g. My Restaurant Menu"
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
                        Description
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
export default AddMenuForm;
