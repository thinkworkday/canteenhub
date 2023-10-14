import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '@store/actions/user.actions';
import { getProfiles } from '@store/actions/customer.actions';

// ** Utils
import { isObjEmpty } from '@utils';

// ** Third Party Components
import {
  Alert, Card, CardBody, FormGroup, Row, Col, Input, Form, Button, Label, Spinner,
} from 'reactstrap';
import classnames from 'classnames';
import { toast } from 'react-toastify';

// ** Components
import CardCustomerProfiles from '@src/components/cards/CardCustomerProfiles';

const AccountForm = ({ selectedUser }) => {
  // ** Vars
  const dispatch = useDispatch();
  const profiles = useSelector((state) => state.profiles.data);
  const {
    register, errors, handleSubmit, setValue,
  } = useForm();
  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  useEffect(() => {
    // set defaults
    const fields = ['firstName', 'lastName', 'email', 'companyName'];
    fields.forEach((field) => setValue(field, selectedUser[field]));
    dispatch(getProfiles('', selectedUser._id));
  }, [selectedUser]);

  const onSubmit = async (values) => {
    // console.log(values);
    setProcessing(true);

    if (isObjEmpty(errors)) {
      try {
        await dispatch(updateUser(selectedUser._id, values));
        toast.success('Record updated');
        // toggleSidebar();
      } catch (err) {
        setApiErrors(err.response ? err.response : { data: err.response.data });
      }

      setProcessing(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col sm="12" xl={8}>

          <Card>
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
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col sm="12" xl={4}>
          <CardCustomerProfiles data={profiles || {}} editable={false} cta={false} dashboardCard={false} />
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
