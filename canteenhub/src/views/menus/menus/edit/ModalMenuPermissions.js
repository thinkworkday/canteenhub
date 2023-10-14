/* eslint-disable react/jsx-no-undef */
import React, { useState, useEffect } from 'react';
// import { push } from 'react-router-redux';
import { useHistory } from 'react-router-dom';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import {
  updateMenu, getMenu,
} from '@store/actions/menu.actions';
import { getUsers } from '@store/actions/user.actions';

// ** Reactstrap
import {
  Alert, Card, CardBody, FormGroup, Row, Col, Input, Form, Button, Label, Spinner, Modal, ModalHeader, ModalBody, ModalFooter, CustomInput, UncontrolledTooltip, InputGroup, InputGroupText,
} from 'reactstrap';

// ** Third Party Components
import { toast } from 'react-toastify';
import Select from 'react-select';

// ** Utils
import { isObjEmpty } from '@utils';

// ** Third Party Components
import classnames from 'classnames';
import {
  HelpCircle,
} from 'react-feather';
import UILoader from '@components/ui-loader';
import { store } from '@store/storeConfig/store';

// import { Search } from 'react-feather';

const ModalCreateEditOption = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { selectedMenu } = props;

  const store = useSelector((state) => state.users);

  // ** States
  const [vendorList, setVendorList] = useState([]);
  const [searchTerm, setSearchTerm] = useState(store.params?.q ? store.params.q : '');
  const [currentPage, setCurrentPage] = useState(store.params?.currentPage ? store.params.currentPage : 1);
  const [rowsPerPage, setRowsPerPage] = useState(store.params?.rowsPerPage ? store.params.rowsPerPage : 1000000);

  const {
    register, errors, handleSubmit, control, setValue,
  } = useForm();
  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  // Set dispatch construct
  const dispatchParams = {
    currentPage,
    rowsPerPage,
    role: 'vendor',
    q: searchTerm,
  };

  // ** Get data on mount
  useEffect(() => {
    dispatch(getUsers(dispatchParams));

    const vendorListObj = store.data.map((vendor) => ({ value: vendor._id, label: vendor.companyName }));
    setVendorList(vendorListObj);
  }, [dispatch, store.data.length]);

  const handleClose = async () => {
    props.modalToggle();
  };

  const onSubmit = async (data) => {
    setApiErrors({});
    setProcessing(true);

    if (isObjEmpty(errors)) {
      try {
        const vendors = data.vendors.map((vendor) => vendor.value);
        await dispatch(updateMenu(selectedMenu._id, { vendors }));
        await dispatch(getMenu(selectedMenu._id));
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

      <Modal isOpen={props.modalVisibility} className="modal-md">
        <ModalHeader toggle={() => props.modalToggle()}>
          Vendor permissions
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

                      <p>
                        Select the vendors you would like this menu to be assigned to
                      </p>

                      <Row className="mt-2">
                        <Col sm="12">
                          <FormGroup>
                            <section>

                              <Controller
                                as={Select}
                                options={vendorList}
                                defaultValue={selectedMenu.vendors.map((item) => (vendorList.find((x) => x.value === item)))}
                                name="vendors"
                                isMulti
                                isClearable={false}
                                control={control}
                                className="react-select"
                                classNamePrefix="select"
                              />
                            </section>
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

export default ModalCreateEditOption;
