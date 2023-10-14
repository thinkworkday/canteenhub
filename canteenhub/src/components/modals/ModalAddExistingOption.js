/* eslint-disable react/jsx-no-undef */
import React, { useEffect, useState } from 'react';
// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';

import {
  getMenuOptions, updateMenuItem,
} from '@store/actions/menu.actions';

// ** Reactstrap
// import Avatar from '@components/avatar';
import {
  FormGroup, Row, Col, Form, Button, Label, Spinner, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';

// ** Third Party Components
import { toast } from 'react-toastify';
import CreatableSelect from 'react-select/creatable';

// ** Utils
import { isObjEmpty } from '@utils';

// ** Third Party Components
import classnames from 'classnames';
import {
  HelpCircle, Plus, X,
} from 'react-feather';
import UILoader from '@components/ui-loader';
import { store } from '@store/storeConfig/store';

// import { Search } from 'react-feather';

const ModalExistingOption = (props) => {
  const dispatch = useDispatch();
  const { selectedItem } = props;
  const menuOptions = useSelector((state) => state.records);

  const {
    register, errors, handleSubmit, control,
  } = useForm();
  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  const [optionCount, seOptionCount] = useState(1);
  const [multiSelect, setMultiSelect] = useState(false);
  const [mandatory, setMandatory] = useState(false);

  const [myOptions, setMyOptions] = useState([]);

  // ** Get data on mount
  useEffect(() => {
    dispatch(getMenuOptions());
    const menuOptionsArray = menuOptions.data ? menuOptions.data.map((obj) => ({ value: obj._id, label: obj.name })) : {};
    setMyOptions(menuOptionsArray);
  }, [dispatch, menuOptions.data.length]);

  const handleClose = async () => {
    props.modalToggle();
  };

  const onSubmit = async (data) => {
    // setApiErrors({});
    // setProcessing(true);

    if (isObjEmpty(errors)) {
      // get existing options
      const existingOptions = selectedItem.options.map((obj) => (obj._id));
      const addedOptions = data.options.map((obj) => (obj.value));

      // Merge 2 arrays
      let optionData = existingOptions.concat(addedOptions);

      // Remove duplicates
      optionData = optionData.filter((item, index) => optionData.indexOf(item) === index);

      // console.log('optionData', optionData);

      try {
        await dispatch(updateMenuItem(selectedItem._id, { options: optionData }));
        // // await dispatch(getMenuOptions(store.getState().records.params));
        toast.success('Record updated');
        handleClose();
        setProcessing(false);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        setProcessing(false);
      }
    }
  };

  return (
    <>

      <Modal isOpen={props.modalVisibility}>
        <ModalHeader toggle={() => props.modalToggle()}>
          Add existing option
        </ModalHeader>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody className="">
            <Label>Select options to add to this menu item:</Label>
            <FormGroup>
              <section>
                <Controller
                  as={CreatableSelect}
                  options={myOptions}
                  name="options"
                  isMulti
                  isClearable={false}
                  control={control}
                  className={`react-select ${classnames({ 'is-invalid': errors.options })}`}
                  classNamePrefix="select"
                  rules={{ required: true }}
                />
              </section>
            </FormGroup>
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

export default ModalExistingOption;
