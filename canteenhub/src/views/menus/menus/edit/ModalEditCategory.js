/* eslint-disable react/jsx-no-undef */
import { useState, useEffect } from 'react';

// ** Store & Actions
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { getMenu, updateMenu } from '@store/actions/menu.actions';

// ** Reactstrap
// import Avatar from '@components/avatar';
import {
  Alert, Card, CardBody, FormGroup, Row, Col, Input, Form, Button, Label, Spinner, Modal, ModalHeader, ModalBody, ModalFooter, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';

// ** Utils
import { isObjEmpty, formatMenuForDB } from '@utils';

// ** Third Party Components
import { toast } from 'react-toastify';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';

import classnames from 'classnames';
import {
  HelpCircle, CheckCircle,
} from 'react-feather';
import UILoader from '@components/ui-loader';

const ModalAddCategory = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { selectedMenu, selectedCategory } = props;

  // const menuData = selectedMenu ? selectedMenu.menuData.map((obj, i) => ({ value: i, label: String(Object.keys(obj)) })) : [];
  const menuData = selectedMenu.menuData.map((obj) => ({ value: obj.catName, label: obj.catName }));

  const {
    register, errors, handleSubmit, setValue, clearErrors, control,
  } = useForm();
  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  const [formVisible, setFormVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState();

  const handleClose = async () => {
    props.modalToggle();
    setFormVisible(false);
  };

  const handleInputChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedIndex(selectedOption.value);
      setFormVisible(true);
    }
  };

  const onSubmit = async (data) => {
    // setProcessing(true);
    if (isObjEmpty(errors)) {
      const menuData = selectedMenu.menuData.map((x) => (x.catName === selectedCategory.catName ? { ...x, catName: data.catName } : x));
      const formattedMenuData = formatMenuForDB(menuData);

      // console.log('formattedMenuData', formattedMenuData);

      try {
        await dispatch(updateMenu(selectedMenu._id, { menuData: formattedMenuData }));
        await dispatch(getMenu(selectedMenu._id));
        toast.success('Record updated');
        // history.go(0);
        handleClose();
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
    <>

      <Modal isOpen={props.modalVisibility}>
        <ModalHeader toggle={() => props.modalToggle()}>
          Edit menu category
        </ModalHeader>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody className="p-0">

            { apiErrors.data ? (
              <Alert color="danger">
                <div className="alert-body">
                  <span>{`Error: ${apiErrors.data}`}</span>
                </div>
              </Alert>
            ) : <></>}

            <Row>
              <Col sm="12">
                <Card className="mb-0">
                  <UILoader blocking={isProcessing}>
                    <CardBody>
                      <Row>
                        <Col sm="12">

                          {/* <FormGroup>
                            <Label>Select the category to rename</Label>
                            <Select
                              name="form-field-name"
                              className="react-select mb-2"
                              classNamePrefix="select"
                            // value={val}
                              options={menuData}
                              onChange={handleInputChange}
                              innerRef={register({ required: true })}
                            />
                          </FormGroup> */}

                          {/* <FormGroup className={formVisible ? 'd-block' : 'd-none'}> */}

                          <FormGroup>
                            <Label>
                              Enter the new name for
                              {' '}
                              {selectedCategory?.catName}
                              {' '}
                            </Label>
                            <Input
                              type="text"
                              placeholder="e.g. Sandwiches or Drinks"
                              id="catName"
                              name="catName"
                              defaultValue={selectedCategory?.catName}
                              autoComplete="off"
                              className={classnames({ 'is-invalid': errors.catName })}
                              innerRef={register({ required: true })}
                            />
                          </FormGroup>
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

export default ModalAddCategory;
