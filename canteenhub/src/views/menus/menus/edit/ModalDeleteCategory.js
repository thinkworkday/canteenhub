/* eslint-disable react/jsx-no-undef */
import { useState } from 'react';

// ** Store & Actions
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
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

import classnames from 'classnames';
import UILoader from '@components/ui-loader';

const ModalAddCategory = (props) => {
  const dispatch = useDispatch();
  const { selectedMenu, selectedCategory } = props;

  const menuData = selectedMenu.menuData.map((obj) => ({ value: obj.catName, label: obj.catName }));

  const {
    register, errors, handleSubmit, setValue, clearErrors, control, setError,
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
    if (data.deleteConfirmation !== 'DELETE') {
      setError('deleteConfirmation', {
        type: 'manual',
        message: 'Delete confirmation is incorrect',
      });
    }

    //   setProcessing(true);
    if (isObjEmpty(errors)) {
      const { menuData } = selectedMenu;
      const menuDataUpdated = menuData.filter((prop) => prop.catName !== selectedCategory.catName);
      const formattedMenuData = formatMenuForDB(menuDataUpdated);

      try {
        await dispatch(updateMenu(selectedMenu._id, { menuData: formattedMenuData }));
        await dispatch(getMenu(selectedMenu._id));
        toast.success('Category deleted');
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
          Delete menu category
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
                            <Label>Select the category to delete</Label>
                            <Select
                              name="form-field-name"
                              className="react-select mb-2"
                              classNamePrefix="select"
                              options={menuData}
                              onChange={handleInputChange}
                              innerRef={register({ required: true })}
                            />
                          </FormGroup> */}

                          {/* <FormGroup className={formVisible ? 'd-block' : 'd-none'}> */}
                          <FormGroup>
                            <Label>
                              Type
                              {' '}
                              <strong>DELETE</strong>
                              {' '}
                              to delete
                              {' '}
                              {selectedCategory?.catName}
                            </Label>
                            <Input
                              type="text"
                              id="deleteConfirmation"
                              name="deleteConfirmation"
                              autoComplete="off"
                              className={classnames({ 'is-invalid': errors.deleteConfirmation })}
                              innerRef={register({ required: true })}
                            />
                            {Object.keys(errors).length && errors.deleteConfirmation ? (
                              <small className="text-danger mt-1">{errors.deleteConfirmation.message}</small>
                            ) : null}

                            <small className="text-danger mt-2 d-block">NOTE: this action cannot be undone. Please proceed with caution</small>

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
