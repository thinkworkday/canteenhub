/* eslint-disable react/jsx-key */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useForm } from 'react-hook-form';

import {
  Alert, Card, CardBody, FormGroup, Row, Col, Input, Form, Button, Label, Spinner, UncontrolledTooltip,
} from 'reactstrap';

// ** Utils
import { isObjEmpty } from '@utils';

// ** Store & Actions
// import { AbilityContext } from '@src/utility/context/Can';
// import { updateUser } from '@store/actions/user.actions';
import { updateStore, getStoreUsers } from '@store/actions/vendor.actions';

// ** Third Party Components
import Repeater from '@components/repeater';
import classnames from 'classnames';
import {
  HelpCircle, CheckCircle, X, Plus,
} from 'react-feather';
import { toast } from 'react-toastify';
// import FileUploaderBasic from '@src/components/formComponents/FileUploaderBasic';

const InviteForm = ({ selectedRecord }) => {
  // ** Vars
  const dispatch = useDispatch();
  const storedStoreUsers = useSelector((state) => state.users);

  const {
    register, errors, handleSubmit, setValue, clearErrors, control,
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
    // dispatch(getStoreUsers());
    // setStoreUsers(storedStoreUsers.data.map((obj) => ({ value: obj._id, label: `${obj.firstName} ${obj.lastName}` })));

    // // set defaults
    // const fields = ['storeName', 'storeEmail', 'storePhone', 'storeLogo'];
    // fields.forEach((field) => {
    //   // console.log(field, selectedStore[field]);
    //   setValue(field, selectedStore[field]);
    // });

    // if (mode === 'edit') {
    //   const fields = ['firstName', 'lastName', 'notes', 'allergies'];
    //   fields.forEach((field) => {
    //     setValue(field, selectedRecord[field]);
    //   });
    // }

    // Set select items
    // setValue('storeUsers', selectedStore.storeUsers.map((item) => ({ label: `${item.firstName} ${item.lastName}`, value: item._id })));
  }, [selectedRecord]);

  const onSubmit = async (data) => {
    setProcessing(true);

    alert('Form Submitted');

    // if (isObjEmpty(errors)) {
    //   try {
    //     await dispatch(updateStore(selectedStore._id, data));
    //     toast.success(
    //       <>
    //         <CheckCircle className="mr-1 text-success" />
    //         Record updated
    //       </>, {
    //         position: 'top-right',
    //         autoClose: 2000,
    //         hideProgressBar: true,
    //       }
    //     );
    //     // redirect back to List view
    //     window.location = `${process.env.REACT_APP_SITE_URL}/vendor/stores`;
    //     // toggleSidebar();
    //     setProcessing(false);
    //   } catch (err) {
    //     setApiErrors(err.response ? err.response : { data: err.response.data });
    //   }

    //   setProcessing(false);
    // }
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
            <CardBody>
              {/* <p><strong>Store Details</strong></p> */}
              <Row>
                <Col md="6" sm="12">
                  TODO:
                  - Stat for Users Invited
                  - Stat for Users Accepted
                  - Stat for Pending Invites
                </Col>
                <Col md="4" sm="12">
                  <Card>
                    <CardBody>
                      <p className="mb-0">
                        <span>Invites </span>
                        <HelpCircle id="tipAllergies" size="18px" />
                        <UncontrolledTooltip placement="top" target="tipAllergies">
                          Please provide all allergies. They will be sent to the store provider on every order.
                        </UncontrolledTooltip>
                      </p>

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
                      <Button.Ripple size="sm" className="btn-icon" color="outline-accent" onClick={increaseAllergyCount}>
                        <Plus size={14} />
                        <span className="align-middle ml-25">Add Allergy</span>
                      </Button.Ripple>
                    </CardBody>
                  </Card>

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
export default InviteForm;
