/* eslint-disable react/jsx-no-undef */
import { useState, useEffect } from 'react';

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  getMenu, updateMenu,
  getMenuOptionsFromParent,
} from '@store/actions/menu.actions';

// ** Reactstrap
import {
  Alert, Card, CardBody, FormGroup, Row, Col, CustomInput, Form, Button, Label, Spinner, Modal, ModalHeader, ModalBody, ModalFooter, ListGroup, ListGroupItem, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';

// ** Utils
import { isObjEmpty } from '@utils';

// ** Third Party Components
import Collapsible from 'react-collapsible';
import { toast } from 'react-toastify';
import {
  MoreVertical, ChevronDown, ChevronUp,
} from 'react-feather';
import UILoader from '@components/ui-loader';

const ModalOptionAvailability = (props) => {
  const dispatch = useDispatch();

  const { selectedMenu } = props;
  const menuOptions = useSelector((state) => state.menus.menuOptions);

  const {
    register, errors, handleSubmit,
  } = useForm();
  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  const handleClose = async () => {
    props.modalToggle();
  };

  // ** Get menu options
  useEffect(() => {
    dispatch(getMenuOptionsFromParent(selectedMenu._id));
  }, []);

  const renderTrigger = (optionGroup, unavailableMenuOptions) => {
    const unavailableCount = unavailableMenuOptions && unavailableMenuOptions.length > 0 && optionGroup.options ? optionGroup.options.map((option) => (!!unavailableMenuOptions.includes(option.id))).filter(Boolean).length : 0;
    return (
      <div className="trigger-wrapper d-flex align-items-center justify-content-between">
        <p className="m-0 ">
          {optionGroup.name}
          {unavailableCount > 0 ? (
            <small className="text-danger">
              {`  ${unavailableCount} unavailable`}
            </small>
          ) : '' }
        </p>
        <div>
          <span className="chevron-down"><ChevronDown size={18} /></span>
          <span className="chevron-up"><ChevronUp size={18} /></span>
        </div>
      </div>
    );
  };

  const onSubmit = async (data) => {
    setProcessing(true);
    const { unavailableMenuOptions } = data;

    if (isObjEmpty(errors)) {
      // set vendor to current user (logged in as vendor) - if admin then need to manually specify
      try {
        await dispatch(updateMenu(selectedMenu._id, { menuOptionModifications: { unavailableMenuOptions } }));
        await dispatch(getMenu(selectedMenu._id));
        toast.success('Option availability updated');
        handleClose();
        setProcessing(false);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('Error', err);
        setProcessing(false);
      }
    }
  };

  const renderOptionFields = (menuOptions) => {
    if (!menuOptions) { return null; }

    const unavailableMenuOptions = selectedMenu.menuOptionModifications[0] && selectedMenu.menuOptionModifications[0].unavailableMenuOptions ? selectedMenu.menuOptionModifications[0].unavailableMenuOptions : {};
    const optionGroups = menuOptions.map((optionGroup, i) => (
      <Collapsible
        key={`optionGroup-${i}`}
        trigger={renderTrigger(optionGroup, unavailableMenuOptions)}
        triggerSibling={() => (
          <div className="Collapsible__action">
            {/* <UncontrolledButtonDropdown>
              <DropdownToggle tag="div" className="btn btn-sm">
                <MoreVertical size={14} className="cursor-pointer action-btn" />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem href="#" tag="a" onClick={() => alert('clicked')}>
                  Deactivate group
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown> */}
          </div>
        )}
      >
        <ListGroup>
          { optionGroup.options.map((option, i) => (
            <ListGroupItem className="d-flex align-items-center justify-content-between" key={`option-${i}`}>
              <div>
                {`${option.name} `}
                {option.price ? (
                  <small className="text-primary">
                    (+$
                    {option.price}
                    )
                  </small>
                ) : <></> }
              </div>

              <CustomInput
                type="switch"
                id={`${optionGroup._id}___${option.name}`}
                name="unavailableMenuOptions"
                value={`${option.id}`}
                onClick={() => {}}
                label="Unavailable?"
                inline
                defaultChecked={unavailableMenuOptions && unavailableMenuOptions.length > 0 ? unavailableMenuOptions.includes(option.id) : false}
                // onChange={(e) => { }}
                innerRef={register()}
              />

            </ListGroupItem>
          ))}
        </ListGroup>
      </Collapsible>
    ));

    return optionGroups;
  };

  return (
    <>

      <Modal isOpen={props.modalVisibility}>
        <ModalHeader className="modal-lg" toggle={() => props.modalToggle()}>
          Manage option availability
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
                            <Label className="form-label mb-2" for="catName">
                              The following are the options provided within this menu. You can toggle availability of these options at the menu level. NOTE: by making an option unavailable, you are making it unavailable for all items within this menu
                            </Label>
                            {renderOptionFields(menuOptions)}
                          </FormGroup>
                        </Col>
                      </Row>
                    </CardBody>
                  </UILoader>
                </Card>
              </Col>
            </Row>
          </ModalBody>

          <ModalFooter className="justify-content-start ">
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

export default ModalOptionAvailability;
