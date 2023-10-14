import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import {
  Alert, Card, CardBody, FormGroup, Row, Col, Input, Form, Button, Label, Spinner, UncontrolledTooltip, InputGroup, InputGroupText,
} from 'reactstrap';

// ** Utils
import { isObjEmpty, getVendorCommission } from '@utils';

// ** Third Party Components
import classnames from 'classnames';
import DataTable from 'react-data-table-component';

// import Select from 'react-select';

import {
  HelpCircle,
} from 'react-feather';
import { toast } from 'react-toastify';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '@store/actions/user.actions';
import { getGroups } from '@store/actions/group.actions';
import { getStores } from '@store/actions/vendor.actions';

import { storeColumns } from './storeColumns';

// import { combineReducers } from 'redux';

const AccountForm = ({ selectedUser }) => {
  // ** Vars
  const dispatch = useDispatch();
  const allGroups = useSelector((state) => state.groups.data);
  const stores = useSelector((state) => state.stores);

  // const [groupList, setGroupList] = useState({});

  // get default commission (if empty)
  // const vendorCommission = getVendorCommission(selectedUser);

  // console.log(vendorCommission);
  // setValue('commission', getVendorCommission(selectedUser));

  const {
    register, errors, handleSubmit, setValue,
  } = useForm();
  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  useEffect(() => {
    dispatch(getGroups());

    // if (allGroups.length > 0) {
    //   setGroupList(allGroups.map((obj) => ({ value: obj._id, label: `${obj.companyName}` })));
    // }

    // set defaults
    const fields = ['firstName', 'lastName', 'email', 'companyName'];
    fields.forEach((field) => setValue(field, selectedUser[field]));
    getVendorCommission(selectedUser).then((result) => (setValue('commission', result)));
  }, [selectedUser, dispatch, allGroups.length]);

  useEffect(() => {
    dispatch(getStores({ vendor: selectedUser._id }));
  }, []);

  const onSubmit = async (data) => {
    setProcessing(true);

    if (isObjEmpty(errors)) {
      try {
        // convert storeUsers into a flat array
      //   data.groups = data.groups.map((u) => u.value);

        await dispatch(updateUser(selectedUser._id, data));
        toast.success('Record updated');
      //   // toggleSidebar();
      } catch (err) {
        setApiErrors(err.response ? err.response : { data: err.response.data });
      }

      setProcessing(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>

      <Row>
        <Col md="8" sm="12">

          { apiErrors.data ? (
            <Alert color="danger">
              <div className="alert-body">
                <span>{`Error: ${apiErrors.data}`}</span>
              </div>
            </Alert>
          ) : <></>}

          <Row>
            <Card className="w-100">
              <CardBody>
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
                      <Label className="form-label" for="companyName">
                        Company name
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
                      <Label className="form-label" for="email">
                        Email
                      </Label>
                      <Input
                        type="email"
                        name="email"
                      // disabled
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
          </Row>

          <Row>

            <Card className="w-100">
              <CardBody>

                <Row>

                  <Col md="12" sm="12">
                    <h4>
                      Stores
                      {' '}
                      <small>
                        (
                        {stores.data.length}
                        )
                      </small>
                    </h4>
                    <FormGroup>
                      <DataTable
                        data={stores.data}
                        responsive
                        className="react-dataTable"
                        noHeader
                        pagination
                        // paginationPerPage={rowsPerPage}
                        // paginationRowsPerPageOptions={paginationRowsPerPageOptions}
                        columns={storeColumns}
                        // sortIcon={<ChevronDown />}
                        // paginationDefaultPage={currentPage}
                        // onChangePage={(page) => { handlePaginationChange(page); }}
                        // onChangeRowsPerPage={(currentRowsPerPage, currentPage) => { handleRowPerPageChange(currentRowsPerPage, currentPage); }}
                      />
                    </FormGroup>
                  </Col>

                </Row>
              </CardBody>
            </Card>

          </Row>

        </Col>

        <Col md="4" sm="12">
          {/* <Card>
            <CardBody>
              <Row>
                <Col sm="12">
                  <FormGroup>
                    <Label className="form-label d-flex justify-content-between" for="groups">
                      <span>Groups</span>
                      <HelpCircle id="tipStore" size="18px" />
                      <UncontrolledTooltip placement="top" target="tipStore">
                        Groups that this vendor can service
                      </UncontrolledTooltip>
                    </Label>
                    <Controller
                      as={Select}
                      isMulti
                      // value={commission}
                      options={groupList}
                      name="groups"
                      isClearable={false}
                      control={control}
                      className={`react-select ${classnames({ 'is-invalid': errors.store })}`}
                      classNamePrefix="select"
                    />

                  </FormGroup>
                </Col>
              </Row>

            </CardBody>
          </Card> */}

          <Card>
            <CardBody>
              <Row>
                <Col sm="12">
                  <FormGroup>
                    <Label className="form-label d-flex justify-content-between" for="groups">
                      <span>Commission</span>
                      <HelpCircle id="tipCommission" size="18px" />
                      <UncontrolledTooltip placement="top" target="tipCommission">
                        Commission to be paid to Canteen Hub
                      </UncontrolledTooltip>
                    </Label>

                    <InputGroup className="mb-2">
                      <Input
                        type="number"
                        name="commission"
                        min="0.00"
                        step="0.01"
                        max="20.00"
                        // presicion={2}
                        className={classnames({ 'is-invalid': errors.commission })}
                        innerRef={register({
                          required: true,
                        })}

                      />
                      <InputGroupText>
                        %
                      </InputGroupText>
                    </InputGroup>

                    {Object.keys(errors).length && errors.commission ? (
                      <small className="text-danger mt-1">{errors.commission.message}</small>
                    ) : null}

                  </FormGroup>
                </Col>
              </Row>

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
