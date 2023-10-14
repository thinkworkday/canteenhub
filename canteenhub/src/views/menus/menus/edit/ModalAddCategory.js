/* eslint-disable react/jsx-no-undef */
import { useState } from 'react';

// ** Store & Actions
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { getMenu, updateMenu } from '@store/actions/menu.actions';

// ** Reactstrap
import {
  Alert, Card, CardBody, FormGroup, Row, Col, Input, Form, Button, Label, Spinner, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';

// ** Utils
import { isObjEmpty, formatMenuForDB } from '@utils';

// ** Third Party Components
import { toast } from 'react-toastify';
import classnames from 'classnames';
// import {
//   CheckCircle,
// } from 'react-feather';
import UILoader from '@components/ui-loader';

const ModalAddCategory = (props) => {
  const dispatch = useDispatch();

  const { selectedMenu } = props;

  const {
    register, errors, handleSubmit,
  } = useForm();
  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  const handleClose = async () => {
    props.modalToggle();
  };

  const onSubmit = async (data) => {
    // setProcessing(true);
    const { menuData } = selectedMenu;
    const updatedMenuData = [...menuData, data];
    const formattedMenuData = formatMenuForDB(updatedMenuData);

    if (isObjEmpty(errors)) {
      // set vendor to current user (logged in as vendor) - if admin then need to manually specify
      try {
        await dispatch(updateMenu(selectedMenu._id, { menuData: formattedMenuData }));
        await dispatch(getMenu(selectedMenu._id));
        toast.success('Category created');
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
          Add menu category
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
                          <FormGroup>
                            <Label className="form-label mb-1" for="catName">
                              Add a new category for your menu. Categories are used to group menu items, e.g. Sandwiches, Drinks or Bundles
                            </Label>
                            <Input
                              type="text"
                              placeholder="e.g. Sandwiches or Drinks"
                              id="catName"
                              name="catName"
                              // defaultValue={selectedRecord.name}
                              className={classnames({ 'is-invalid': errors.catName })}
                              innerRef={register({ required: true })}
                            />
                            <small className="d-block mt-2 text-muted">NOTE: Categories are automatically added to the end of the existing category list. You can change the sort order after it has been added at any time</small>
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
