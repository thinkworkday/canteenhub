/* eslint-disable react/jsx-no-undef */
import React, { useEffect, useState } from 'react';

// ** Store & Actions
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  getMenuOptions, getMenuItem, addMenuOption, updateMenuOption,
} from '@store/actions/menu.actions';

// ** Reactstrap
// import Avatar from '@components/avatar';
import {
  Alert, Card, CardBody, FormGroup, Row, Col, Input, Form, Button, Label, Spinner, Modal, ModalHeader, ModalBody, ModalFooter, CustomInput, UncontrolledTooltip, InputGroup, InputGroupText,
} from 'reactstrap';

// ** Third Party Components
import { toast } from 'react-toastify';
import Repeater from '@components/repeater';

// ** Utils
import { isObjEmpty } from '@utils';
import { v4 as uuidv4 } from 'uuid';

// ** Third Party Components
import classnames from 'classnames';
import {
  HelpCircle, Plus, X,
} from 'react-feather';
import UILoader from '@components/ui-loader';
import { store } from '@store/storeConfig/store';

// import { Search } from 'react-feather';

const ModalCreateEditOption = (props) => {
  const dispatch = useDispatch();
  const { selectedRecord, selectedItem } = props;

  const {
    register, errors, handleSubmit,
  } = useForm();
  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  const [optionCount, seOptionCount] = useState(1);
  const [multiSelect, setMultiSelect] = useState(false);
  const [mandatory, setMandatory] = useState(false);

  const increaseOptionCount = () => {
    seOptionCount(optionCount + 1);
  };

  // ** Get data on mount
  useEffect(() => {
    setMultiSelect(!!(selectedRecord && selectedRecord.multiSelect));
    setMandatory(!!(selectedRecord && selectedRecord.mandatory));
    seOptionCount(selectedRecord && selectedRecord.options ? selectedRecord.options.length : 1);
  }, [selectedRecord]);

  const deleteFormRow = (e) => {
    e.preventDefault();
    const rowElement = e.target.closest('.repeater-option-row');
    const inputELements = rowElement.querySelectorAll('input');
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < inputELements.length; i++) {
      inputELements[i].value = '';
    }
    e.target.closest('.repeater-option-row').remove();
  };

  const handleClose = async () => {
    props.modalToggle();
  };

  const formatOptionData = async (optionDataRaw) => {
    if (optionDataRaw) {
      optionDataRaw = optionDataRaw.name.map((obj, i) => {
        const rObj = {};
        if (obj) {
          rObj.id = optionDataRaw.id[i] ? optionDataRaw.id[i] : uuidv4();
          rObj.name = obj;
          rObj.price = optionDataRaw.price[i];
          return rObj;
        }
        return null;
      });
      optionDataRaw = optionDataRaw.filter((x) => x != null);
    }

    if ((!optionDataRaw || optionDataRaw.length <= 0)) {
      await setApiErrors((!optionDataRaw || optionDataRaw.length <= 0) ? { data: 'You must add at least one option' } : {});
      return false;
    }
    return optionDataRaw;
  };

  const onSubmit = async (data) => {
    setApiErrors({});
    // setProcessing(true);

    if (isObjEmpty(errors)) {
      // set vendor to current user (logged in as vendor) - if admin then need to manually specify

      try {
        // first check that we have Options
        const optionData = await formatOptionData(data.options);

        if (optionData) {
          data.options = optionData;
          if (selectedRecord) {
            await dispatch(updateMenuOption(selectedRecord._id, data));
            await dispatch(getMenuOptions(store.getState().records.params));
          } else {
            if (selectedItem) { data.itemObjId = selectedItem._id; }
            await dispatch(addMenuOption(data));
            if (selectedItem) {
              await dispatch(getMenuItem(selectedItem._id));
              // await dispatch(getMenuOptions(store.getState().records.params));
            } else {
              await dispatch(getMenuOptions(store.getState().records.params));
            }
          }
          toast.success('Record updated');
          handleClose();
          setProcessing(false);
        } else {
          throw new ('No options selected')();
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        // console.log(err);
        setProcessing(false);
      }
    }
  };

  return (
    <>

      <Modal isOpen={props.modalVisibility} className="modal-lg">
        <ModalHeader toggle={() => props.modalToggle()}>
          {selectedRecord ? 'Edit' : 'Add'}
          {' '}
          option group
        </ModalHeader>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody className="p-0">

            <Row>
              <Col sm="12">
                <Card className="mb-0">
                  <UILoader blocking={isProcessing}>
                    <CardBody>

                      { apiErrors.data ? (
                        <Alert color="danger">
                          <div className="alert-body">
                            <span>{`Error: ${apiErrors.data}`}</span>
                          </div>
                        </Alert>
                      ) : <></>}

                      <Row className="justify-content-between">
                        <Col sm="12" md="4">
                          <FormGroup>
                            <Label className="form-label" for="name">
                              Name
                            </Label>
                            <Input
                              type="text"
                              placeholder="e.g. Size, Vegetables etc."
                              id="name"
                              name="name"
                              defaultValue={selectedRecord ? selectedRecord.name : ''}
                              className={classnames({ 'is-invalid': errors.name })}
                              innerRef={register({ required: true })}
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label className="form-label" for="description">
                              Description
                            </Label>
                            <Input
                              type="textarea"
                              id="description"
                              name="description"
                              defaultValue={selectedRecord ? selectedRecord.description : ''}
                              // defaultValue={selectedRecord.name}
                              className={classnames({ 'is-invalid': errors.catName })}
                              innerRef={register()}
                            />
                          </FormGroup>

                          <FormGroup>
                            <CustomInput
                              type="switch"
                              id="multiSelect"
                              name="multiSelect"
                              // eslint-disable-next-line no-unused-vars
                              onClick={(e) => {}}
                              label="Multi-select?"
                              inline
                              onChange={(e) => { setMultiSelect(e.target.checked); }}
                              innerRef={register()}
                              checked={multiSelect}
                            />
                          </FormGroup>

                          <FormGroup>
                            <CustomInput
                              type="switch"
                              id="mandatory"
                              name="mandatory"
                              // eslint-disable-next-line no-unused-vars
                              onClick={(e) => {}}
                              label="Mandatory?"
                              inline
                              onChange={(e) => { setMandatory(e.target.checked); }}
                              innerRef={register()}
                              checked={mandatory}
                            />
                          </FormGroup>

                        </Col>

                        <Col sm="12" md="7">
                          <Label className="form-label" for="description">
                            Options
                          </Label>
                          <HelpCircle id="tipOptions" size="18px" />
                          <UncontrolledTooltip placement="top" target="tipOptions">
                            Add all option values. If additional pricing, then please provide.
                          </UncontrolledTooltip>

                          { errors.options ? (
                            <Alert color="danger">
                              <div className="alert-body">
                                <span>{`${errors.options.message}`}</span>
                              </div>
                            </Alert>
                          ) : <></>}

                          <Repeater count={optionCount}>
                            {(i) => (
                              <div className="repeater-row-sm repeater-option-row" key={i}>
                                <Row className="justify-content-between align-items-top">
                                  <Col md={10} className="d-flex">
                                    <Row>
                                      <Col sm={8}>
                                        <FormGroup>
                                          <Input
                                            type="hidden"
                                            id={`options-id${i}`}
                                            name={`options.id[${i}]`}
                                            innerRef={register()}
                                            defaultValue={selectedRecord && selectedRecord.options && selectedRecord?.options[i] ? selectedRecord.options[i].id : ''}
                                          />
                                          <Input
                                            type="text"
                                            bsSize="sm"
                                            id={`options-name${i}`}
                                            name={`options.name[${i}]`}
                                            placeholder="Option name"
                                            innerRef={register()}
                                            defaultValue={selectedRecord && selectedRecord.options && selectedRecord?.options[i] ? selectedRecord.options[i].name : ''}
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col sm={4} className="d-flex">
                                        <FormGroup>
                                          <InputGroup>
                                            <InputGroupText className="input-group-small">$</InputGroupText>
                                            <Input
                                              type="text"
                                              bsSize="sm"
                                              id={`options-price${i}`}
                                              name={`options.price[${i}]`}
                                              className={classnames({ 'is-invalid': errors.price })}
                                              innerRef={register()}
                                              defaultValue={selectedRecord && selectedRecord.options && selectedRecord.options[i] ? selectedRecord.options[i].price : ''}
                                            />
                                          </InputGroup>
                                        </FormGroup>
                                      </Col>

                                    </Row>
                                  </Col>
                                  <Col md={2}>
                                    <Button.Ripple size="xs" color="danger" className="text-nowrap " onClick={deleteFormRow} outline>
                                      <X size={14} />
                                    </Button.Ripple>
                                  </Col>

                                </Row>
                              </div>
                            )}
                          </Repeater>
                          <Button.Ripple size="xs" className="btn-icon" color="danger" outline onClick={increaseOptionCount}>
                            <Plus size={14} />
                            <span className="align-middle ml-25">Add Option</span>
                          </Button.Ripple>

                        </Col>
                      </Row>

                    </CardBody>
                  </UILoader>

                </Card>

              </Col>

            </Row>

          </ModalBody>

          <ModalFooter className="justify-content-start">
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

                  <Button.Ripple outline color="flat-secondary" onClick={() => handleClose()}>
                    Cancel
                  </Button.Ripple>
                </FormGroup>
              </Col>
            </Row>
          </ModalFooter>

        </Form>
      </Modal>
    </>

  );
};

export default ModalCreateEditOption;
