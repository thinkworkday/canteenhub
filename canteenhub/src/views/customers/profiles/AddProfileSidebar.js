/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-plusplus */
// ** React Imports
import { Fragment, useState, useEffect } from 'react';

// ** Components
import CardProfileAssignGroup from '@src/components/cards/CardProfileAssignGroup';

// ** Third Party Components
import classnames from 'classnames';
import { toast } from 'react-toastify';
import {
  X, HelpCircle,
} from 'react-feather';
import { useForm, Controller } from 'react-hook-form';
import {
  Button, Modal, ModalHeader, ModalBody, FormGroup, Label, Input, Form, UncontrolledTooltip, Row, Col,
} from 'reactstrap';
import CreatableSelect from 'react-select/creatable';

// ** Utils
import { getLoggedUser } from '@utils';

// ** Store & Actions
import {
  addProfile, updateProfile, getProfiles, selectProfile,
} from '@store/actions/customer.actions';

const AddProfileSidebar = (props) => {
  // ** Props
  const {
    selectedProfile,
    dispatch,
    open,
    handleAddProfileSidebar,
  } = props;

  const {
    register, errors, handleSubmit, control, setValue,
  } = useForm();

  const loggedUser = getLoggedUser();

  // ** States
  const [isProcessing, setProcessing] = useState(false);
  const [subGroupSelected, setSubGroupSelected] = useState(false);

  useEffect(() => {
    if (selectedProfile) {
      const fields = ['firstName', 'lastName', 'notes'];
      setTimeout(() => {
        fields.forEach((field) => {
          setValue(field, selectedProfile[field]);
        });
        setValue('allergies', selectedProfile.allergies.map((allergy) => ({ value: allergy, label: allergy })));
        setSubGroupSelected({ group: { group: selectedProfile.group }, subgroup: selectedProfile.subgroups[0] });
      });
    }
  }, [setValue, open]);

  // ** Handle Form Submit (Add & Edit)
  const handleFormSubmit = async (data) => {
    // data.customer = loggedUser._id;
    // data.allergies = data.allergies.map((allergy) => allergy.label);

    const postData = {
      ...data,
      customer: loggedUser._id,
      allergies: data.allergies ? data.allergies.map((allergy) => allergy.label) : [],
      group: subGroupSelected ? subGroupSelected.group.group._id : null,
      subgroups: subGroupSelected ? [subGroupSelected.subgroup._id] : [],
    };
    try {
      if (selectedProfile) {
        // ** Edit
        await dispatch(updateProfile(selectedProfile._id, postData));
        toast.success('Record updated');
      } else {
        // ** Add
        await dispatch(addProfile(postData));
        toast.success('Record created');
      }

      await dispatch(getProfiles());
      handleAddProfileSidebar();
      setProcessing(false);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      // if (err.response && err.response.status === 500) {
      //   setApiErrors({ data: 'Could not upload image. File format error' });
      // } else {
      //   setApiErrors(err.response ? err.response : { data: err.response.data });
      // }
      setProcessing(false);
    }
  };

  // ** Reset Input Values on Close
  // const handleSelectedProfile = () => {
  //   // clear selectedProfile in store
  //   console.log('Open Form');
  //   setSubGroupSelected({ group: { group: selectedProfile.group }, subgroup: selectedProfile.subgroups[0] });
  // };

  // ** Reset Input Values on Close
  const handleResetInputValues = () => {
    // clear selectedProfile in store
    dispatch(selectProfile());
    setSubGroupSelected();
  };

  // ** Event Action buttons
  const EventActions = () => {
    // if (isObjEmpty(selectedProfile) || (!isObjEmpty(selectedProfile) && !selectedProfile.firstName.length)) {
    if (!selectedProfile) {
      return (
        <>
          <Button.Ripple className="mr-1" type="submit" color="primary">
            Add Profile
          </Button.Ripple>
          <Button.Ripple color="secondary" type="reset" onClick={handleAddProfileSidebar} outline>
            Cancel
          </Button.Ripple>
        </>
      );
    }
    return (
      <>
        <Button.Ripple
          className="mr-1"
          color="primary"
          type="submit"
        >
          Update
        </Button.Ripple>

      </>
    );
  };

  // ** Close BTN
  const CloseBtn = <X className="cursor-pointer" size={15} onClick={handleAddProfileSidebar} />;

  return (
    <Modal
      isOpen={open}
      toggle={handleAddProfileSidebar}
      className="sidebar-lg"
      contentClassName="p-0"
      // onOpened={handleSelectedProfile}
      onClosed={handleResetInputValues}
      modalClassName="modal-slide-in event-sidebar"
    >
      <ModalHeader className="mb-0" toggle={handleAddProfileSidebar} close={CloseBtn} tag="div">
        <h5 className="modal-title">
          {selectedProfile && selectedProfile.firstName && selectedProfile.firstName.length ? 'Update' : 'Add'}
          {' '}
          Profile
        </h5>
      </ModalHeader>
      <ModalBody className="flex-grow-1 pb-sm-0 pb-3">
        <Form
          onSubmit={handleSubmit((data) => {
            handleFormSubmit(data);
          })}
        >
          <Row>
            <Col md="6" sm="12">
              <FormGroup>
                <Label className="form-label" for="firstName">
                  First Name*
                </Label>
                <Input
                  type="text"
                  placeholder=""
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
                  Last Name*
                </Label>
                <Input
                  type="text"
                  placeholder=""
                  id="lastName"
                  name="lastName"
                  className={classnames({ 'is-invalid': errors.lastName })}
                  innerRef={register()}
                />
              </FormGroup>
            </Col>
          </Row>

          {/* <CardProfileAssignGroup profile={selectedRecord} /> */}
          <CardProfileAssignGroup subGroupSelected={subGroupSelected} setSubGroupSelected={setSubGroupSelected} />

          <FormGroup>
            <FormGroup>

              <Label className="form-label" for="allergies">
                <span>Allergies </span>
                <HelpCircle id="tipAllergies" size="18px" />
                <UncontrolledTooltip placement="top" target="tipAllergies">
                  Please provide all allergies. They will be sent to the store provider on every order.
                </UncontrolledTooltip>
              </Label>

              <section>
                <Controller
                  as={CreatableSelect}
                  options={[]}
                  name="allergies"
                  isMulti
                  isClearable={false}
                  control={control}
                  className="react-select"
                  classNamePrefix="select"
                  placeholder="Type any allergies and hit `enter`"
                  noOptionsMessage={() => 'No allergy options'}
                  formatCreateLabel={(inputValue) => `Add ${inputValue}? Hit 'Enter'`}
                />
              </section>
            </FormGroup>

          </FormGroup>

          <FormGroup>
            <Label className="form-label" for="notes">
              <span>Notes </span>
              <HelpCircle id="tipStoreEmail" size="18px" />
              <UncontrolledTooltip placement="top" target="tipStoreEmail">
                Please provide any notes that you would like to be send on all orders for this profile
              </UncontrolledTooltip>
            </Label>
            <Input
              type="textarea"
              placeholder=""
              id="notes"
              name="notes"
              className={classnames({ 'is-invalid': errors.notes })}
              innerRef={register()}
            />
          </FormGroup>

          <FormGroup className="d-flex mt-2">
            <EventActions />
          </FormGroup>
        </Form>
      </ModalBody>

    </Modal>
  );
};

export default AddProfileSidebar;
