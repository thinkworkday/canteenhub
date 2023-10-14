/* eslint-disable no-loop-func */
/* eslint-disable no-undef */
/* eslint-disable no-plusplus */
/* eslint-disable react/jsx-no-undef */
import { useState } from 'react';

// ** Store & Actions
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { store } from '@store/storeConfig/store';

// ** Reactstrap
// import Avatar from '@components/avatar';
import {
  Alert, Card, CardBody, FormGroup, Row, Col, Form, Button, Spinner, Modal, ModalHeader, ModalBody, ModalFooter, ListGroupItem,
} from 'reactstrap';

// ** Third Party Components
import { toast } from 'react-toastify';

// ** Utils
import { formatMenuForDB } from '@utils';

// ** Store & Actions
import { getMenu, updateMenu } from '@store/actions/menu.actions';

// ** Third Party Components
import { ReactSortable } from 'react-sortablejs';
import {
  Menu,
} from 'react-feather';
import UILoader from '@components/ui-loader';

// import { Search } from 'react-feather';

const ModalAddCategory = (props) => {
  const dispatch = useDispatch();
  const { selectedMenu } = props;

  const {
    handleSubmit,
  } = useForm();
  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  // const [listArr, setListArr] = useState(listItems);
  const [listArr, setListArr] = useState((selectedMenu.menuData));

  // const selectedMenu = useSelector((state) => state.menus.selectedMenu);

  const handleClose = async () => {
    props.modalToggle();
  };

  const onSubmit = async () => {
    setProcessing(true);

    const menuData = listArr.map((item) => {
      delete item.chosen;
      delete item.selected;
      return (item);
    });

    const formattedMenuData = formatMenuForDB(menuData);

    try {
      await dispatch(updateMenu(selectedMenu._id, { menuData: formattedMenuData }));
      await dispatch(getMenu(store.getState().menus.selectedMenu._id));

      toast.success(
        'Sort order updated',
      );
      handleClose();
      setProcessing(false);
    } catch (err) {
      if (err.response && err.response.status === 500) {
        setApiErrors({ data: 'Could not upload image. File format error' });
      } else {
        setApiErrors(err.response ? err.response : { data: err.response.data });
      }
      setProcessing(false);
    }
  };

  return (
    <>

      <Modal isOpen={props.modalVisibility}>
        <ModalHeader toggle={() => props.modalToggle()}>
          Manage Categories
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
                      <ReactSortable
                        tag="ul"
                        id="categoryList"
                        className="list-group sortable"
                        group="shared-handle-group"
                        handle=".handle"
                        list={listArr}
                        setList={setListArr}
                      >
                        {listArr.map((item, i) => {
                          const { catName } = item;
                          return (
                            <ListGroupItem className="draggable d-flex align-items-center" key={i}>
                              <Menu className="handle" size="30" />
                              <div>
                                {catName}
                              </div>
                            </ListGroupItem>
                          );
                        })}
                      </ReactSortable>

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
