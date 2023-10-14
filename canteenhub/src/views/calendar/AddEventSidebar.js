/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-plusplus */
// ** React Imports
import { Fragment, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// ** Store & Actions
import { getStores } from '@store/actions/vendor.actions';
import { getGroups } from '@store/actions/group.actions';
import { getMenus } from '@store/actions/menu.actions';

// ** Utils
import { getLoggedUser, isObjEmpty } from '@utils';

import timezones from '@src/assets/data/timezones';

// ** Custom Components
import Avatar from '@components/avatar';

// ** Third Party Components
import moment from 'moment';
import classnames from 'classnames';
import { toast } from 'react-toastify';
import Flatpickr from 'react-flatpickr';
import {
  X, Trash, HelpCircle, Calendar,
} from 'react-feather';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import {
  Button, Modal, ModalHeader, ModalBody, FormGroup, Label, Input, Form, UncontrolledTooltip, Row, Col, InputGroup, InputGroupText,
} from 'reactstrap';
// import NumberInput from '@components/number-input';

// ** Styles Imports
import '@styles/react/libs/react-select/_react-select.scss';
import '@styles/react/libs/flatpickr/flatpickr.scss';

// ** Toast Component
const ToastComponent = ({ title, icon, color }) => (
  <>
    <div className="toastify-header pb-0">
      <div className="title-wrapper">
        <Avatar size="sm" color={color} icon={icon} />
        <h6 className="toast-title">{title}</h6>
      </div>
    </div>
  </>
);

const AddEventSidebar = (props) => {
  // ** Props
  const {
    store,
    dispatch,
    open,
    handleAddEventSidebar,
    calendarApi,
    refetchEvents,
    addEvent,
    selectEvent,
    removeEvent,
  } = props;

  const loggedUser = getLoggedUser();

  // ** Vars
  const { selectedEvent } = store || {};
  const stores = useSelector((state) => state.stores);
  const groups = useSelector((state) => state.groups);
  const menus = useSelector((state) => state.menus);

  const {
    register, errors, handleSubmit, control,
  } = useForm();

  // ** States
  const [storeList, setStoreList] = useState({});
  const [groupList, setGroupList] = useState({});
  const [menuList, setMenuList] = useState({});
  const [datesSelected, setDatesSelected] = useState();
  const [datesSelectedCount, setDatesSelectedCount] = useState(0);

  const [timezoneList, setTimezoneList] = useState(timezones);
  const [eventTimezone, setTimezone] = useState({ value: Intl.DateTimeFormat().resolvedOptions().timeZone, label: Intl.DateTimeFormat().resolvedOptions().timeZone });

  // ** Adds New Event
  const handleAddEvent = (data) => {
    const momentDate = moment(data.deliveryTime[0]).toDate();
    const obj = {
      ...data,
      dates: data.dates.replaceAll(' ', '').split(',').sort(),
      vendor: loggedUser._id,
      store: data.store.value,
      group: data.group.value,
      menus: [data.menus.value],
      deliveryTime: moment(momentDate).format('hh:mm A'),
      timezone: eventTimezone.value,
    };

    // console.log(obj);
    dispatch(addEvent(obj));
    refetchEvents(); // check Calendar API
    handleAddEventSidebar();
    toast.success('Events added');
  };

  // ** Reset Input Values on Close
  const handleResetInputValues = () => {
    dispatch(selectEvent({}));
  };

  // ** (UI) removeEventInCalendar
  const removeEventInCalendar = (eventId) => {
    calendarApi.getEventById(eventId).remove();
  };
  const handleDeleteEvent = () => {
    dispatch(removeEvent(selectedEvent.id));
    removeEventInCalendar(selectedEvent.id);
    handleAddEventSidebar();
    toast.error(<ToastComponent title="Event Removed" color="danger" icon={<Trash />} />, {
      autoClose: 2000,
      hideProgressBar: true,
      closeButton: false,
    });
  };

  // ** Event Action buttons
  const EventActions = () => {
    if (isObjEmpty(selectedEvent) || (!isObjEmpty(selectedEvent) && !selectedEvent.title.length)) {
      return (
        <>
          <Button.Ripple className="mr-1" type="submit" color="primary">
            Add
            {' '}
            {datesSelectedCount > 0 ? datesSelectedCount : ''}
            {datesSelectedCount > 1 ? ' Events' : ' Event'}
          </Button.Ripple>
          <Button.Ripple color="secondary" type="reset" onClick={handleAddEventSidebar} outline>
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
        >
          Update
        </Button.Ripple>
        <Button.Ripple color="danger" onClick={handleDeleteEvent} outline>
          Delete
        </Button.Ripple>
      </>
    );
  };

  // ** Close BTN
  const CloseBtn = <X className="cursor-pointer" size={15} onClick={handleAddEventSidebar} />;

  // ** Get data on mount
  useEffect(() => {
    dispatch(getStores());
    if (stores) {
      setStoreList(stores.data.map((obj) => ({ value: obj._id, label: `${obj.storeName}` })));
    }

    dispatch(getGroups());
    if (groups) {
      setGroupList(groups.data.map((obj) => (obj.emailVerified ? { value: obj._id, label: `${obj.companyName}` } : { value: obj._id, label: `${obj.companyName} (not verified)`, isDisabled: true })));
    }

    dispatch(getMenus());
    if (menus) {
      setMenuList(menus.data.map((obj) => ({ value: obj._id, label: `${obj.name}` })));
    }
  }, [dispatch, setStoreList, stores.data.length, setGroupList, groups.data.length, setMenuList, menus.data.length, errors]);

  // console.log('Errors', errors);

  return (
    <Modal
      isOpen={open}
      toggle={handleAddEventSidebar}
      className="sidebar-lg"
      contentClassName="p-0"
      // onOpened={handleSelectedEvent}
      onClosed={handleResetInputValues}
      modalClassName="modal-slide-in event-sidebar"
    >
      <ModalHeader className="mb-0" toggle={handleAddEventSidebar} close={CloseBtn} tag="div">
        <h5 className="modal-title">
          {selectedEvent && selectedEvent.title && selectedEvent.title.length ? 'Update' : 'Add'}
          {' '}
          Event
        </h5>
      </ModalHeader>
      <ModalBody className="flex-grow-1 pb-sm-0 pb-3">
        <Form
          onSubmit={handleSubmit((data) => {
            if (isObjEmpty(errors)) {
              if (isObjEmpty(selectedEvent) || (!isObjEmpty(selectedEvent) && !selectedEvent.title.length)) {
                handleAddEvent(data);
              } else {
                // handleUpdateEvent();
              }
              // handleAddEventSidebar();
            }
          })}
        >
          <FormGroup>
            <Label for="title">
              Title
              {' '}
              <span className="text-danger">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Term 1 - 2022"
              // onChange={(e) => setTitle(e.target.value)}
              innerRef={register({ register: true, validate: (value) => value !== '' })}
              className={classnames({
                'is-invalid': errors.title,
              })}
            />
          </FormGroup>

          <FormGroup>
            <Label className="form-label d-flex justify-content-between" for="store">
              <span>
                Store
                {' '}
                <span className="text-danger">*</span>

              </span>
              <HelpCircle id="tipStore" size="18px" />
              <UncontrolledTooltip placement="top" target="tipStore">
                Select the store that will provide the lunches for these dates
              </UncontrolledTooltip>
            </Label>
            <Controller
              as={Select}
              options={storeList}
              name="store"
              isClearable={false}
              control={control}
              className={`react-select ${classnames({ 'is-invalid': errors.store })}`}
              classNamePrefix="select"
              rules={{ required: true }}
            />
            {Object.keys(errors).length && errors.store ? (
              <small className="text-danger mt-1">You must select at least one store</small>
            ) : null}
          </FormGroup>

          <FormGroup>
            <Label className="form-label d-flex justify-content-between" for="group">
              <span>
                School
                {' '}
                <span className="text-danger">*</span>
              </span>
              <HelpCircle id="tipStore" size="18px" />
              <UncontrolledTooltip placement="top" target="tipStore">
                Select the school to apply these events to
              </UncontrolledTooltip>
            </Label>
            <Controller
              as={Select}
              options={groupList}
              name="group"
              isClearable={false}
              control={control}
              className={`react-select ${classnames({ 'is-invalid': errors.group })}`}
              classNamePrefix="select"
              rules={{ required: true }}
            />
            {Object.keys(errors).length && errors.group ? (
              <small className="text-danger mt-1">You must select at least one school</small>
            ) : null}
          </FormGroup>

          <FormGroup>
            <Label className="form-label d-flex justify-content-between" for="menu">
              <span>
                Menu
                {' '}
                <span className="text-danger">*</span>
              </span>
              <HelpCircle id="tipMenu" size="18px" />
              <UncontrolledTooltip placement="top" target="tipMenu">
                Optionally select a menu specific to this event
              </UncontrolledTooltip>
            </Label>
            <Controller
              as={Select}
              options={menuList}
              name="menus"
              isClearable={false}
              control={control}
              className={`react-select ${classnames({ 'is-invalid': errors.menus })}`}
              rules={{ required: true }}
              classNamePrefix="select"
            />
            {Object.keys(errors).length && errors.group ? (
              <small className="text-danger mt-1">Menu is mandatory</small>
            ) : null}
          </FormGroup>

          <FormGroup>

            <Label for="dates" className="d-flex">
              <span>
                Date(s)
                {' '}
                <span className="text-danger">*</span>
              </span>
              <HelpCircle id="tipStore" size="18px" className="ml-auto" />
              <UncontrolledTooltip placement="top" target="tipStore">
                Dates can be changed only if no orders have been placed. So please be careful in selecting these.
              </UncontrolledTooltip>
            </Label>

            <Flatpickr
              data-input
              options={{
                mode: 'multiple',
                minDate: 'today',
                wrap: true,
                onValueUpdate(selectedDates, dateStr) {
                  setDatesSelected(dateStr);
                  setDatesSelectedCount(selectedDates.length);
                },
              }}
            >
              <div className={`date-selector d-flex align-items-center ${classnames({ 'is-invalid': errors.dates })}`}>
                <Button.Ripple color="secondary" outline size="xs" data-toggle>
                  <Calendar size={16} />
                </Button.Ripple>
                <div data-toggle>
                  {datesSelectedCount === 0 ? <div className="text-muted">No dates selected</div> : (
                    <>
                      <span id="tipDates">{`${datesSelectedCount} dates selected`}</span>
                      <UncontrolledTooltip placement="top" target="tipDates">
                        {datesSelected}
                      </UncontrolledTooltip>
                    </>
                  )}
                </div>

                <Input
                  id="dates"
                  name="dates"
                  data-input
                  innerRef={register({ register: true, validate: (value) => value !== '' })}
                  className={classnames({
                    'is-invalid': errors.dates,
                  })}
                />
              </div>

              {Object.keys(errors).length && errors.dates ? (
                <small className="text-danger mt-1">You must select at least one event date</small>
              ) : null}

            </Flatpickr>
          </FormGroup>

          <Row>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="dates" className="d-flex">
                  <span>Delivery Time</span>
                  {' '}
                  <span className="text-danger">*</span>
                  <HelpCircle id="tipDeliveryTime" size="18px" className="ml-auto" />
                  <UncontrolledTooltip placement="top" target="tipDeliveryTime">
                    The delivery time for orders. Note: these can be adjusted for each date once the event is saved.
                  </UncontrolledTooltip>
                </Label>
                <Controller
                  as={Flatpickr}
                  name="deliveryTime"
                  control={control}
                  className={`form-control  ${classnames({ 'is-invalid': errors.deliveryTime })}`}
                  options={{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: 'h:i K',
                  }}
                  rules={{ required: true }}
                />
                {Object.keys(errors).length && errors.deliveryTime ? (
                  <small className="text-danger mt-1">Delivery time is mandatory</small>
                ) : null}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="dates" className="d-flex">
                  <span>
                    Cutoff Period
                    {' '}
                    <span className="text-danger">*</span>
                  </span>
                  <HelpCircle id="tipCutOffTime" size="18px" className="ml-auto" />
                  <UncontrolledTooltip placement="top" target="tipCutOffTime">
                    The period of time (in hours) before the order date in which all new orders will be blocked. E.g. 24 hrs will stop customer from order 24 hrs before delivery date / time
                  </UncontrolledTooltip>
                </Label>
                <InputGroup className="input-group-merge mb-2">
                  <Input
                    type="number"
                    name="cutoffPeriod"
                    placeholder="24"
                    className={classnames({ 'is-invalid': errors.cutoffPeriod })}
                    innerRef={register({ required: true })}
                  />
                  <InputGroupText>hours</InputGroupText>
                </InputGroup>

                {Object.keys(errors).length && errors.cutoffPeriod ? (
                  <small className="text-danger mt-1">Cutoff period is mandatory</small>
                ) : null}
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col>
              <FormGroup>
                <Label for="timezone">
                  Event Timezone:
                </Label>
                <Select
                  options={timezoneList}
                  name="timezone"
                  defaultValue={eventTimezone}
                  className={`react-select ${classnames({ 'is-invalid': errors.timezone })}`}
                  classNamePrefix="select"
                  onChange={(value) => {
                    setTimezone(value);
                  }}
                />
                {Object.keys(errors).length && errors.timezone ? (
                  <small className="text-danger mt-1">You must select a timezone in which the event will take place</small>
                ) : null}
              </FormGroup>
            </Col>
          </Row>

          <FormGroup className="d-flex mt-2">
            <EventActions />
          </FormGroup>
        </Form>
      </ModalBody>

    </Modal>
  );
};

export default AddEventSidebar;
