/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-plusplus */
// ** React Imports
import { useState, useEffect } from 'react';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';

// ** Store & Actions
import { fetchEvents } from '@store/actions/event.actions';
import { getGroups } from '@store/actions/group.actions';
// import { getOrders } from '@store/actions/order.actions';
import statusOptions from '@src/models/constants/orderStatus';

// ** Utils
import { isObjEmpty } from '@utils';
import moment from 'moment';
// ** Custom Components

// ** Third Party Components
// import moment from 'moment';
import classnames from 'classnames';
import Flatpickr from 'react-flatpickr';
import {
  X, Calendar,
} from 'react-feather';
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import {
  Button, Modal, ModalHeader, ModalBody, FormGroup, Label, Input, Form,
} from 'reactstrap';
// import NumberInput from '@components/number-input';

// ** Styles Imports
import '@styles/react/libs/react-select/_react-select.scss';
import '@styles/react/libs/flatpickr/flatpickr.scss';

const AddEventSidebar = (props) => {
  // ** Props
  const {
    open,
    handleFilterSidebar,
    dispatchParams,
    setDispatchParams,
  } = props;

  const dispatch = useDispatch();

  // ** Vars
  const groups = useSelector((state) => state.groups);

  // ** States
  const [selectedStatus, setSelectedStatus] = useState({ name: '', value: '' });
  // const [selectedGroup, setSelectedGroup] = useState(selectedGroup.menus && selectedEvent.menus[0] ? { value: selectedEvent.menus[0]._id, label: selectedEvent.menus[0].name } : { name: '', value: '' });
  const [selectedGroup, setSelectedGroup] = useState({});
  const [groupList, setGroupList] = useState({});

  // const [selectedMenu, setSelectedMenu] = useState(selectedEvent.menus && selectedEvent.menus[0] ? { value: selectedEvent.menus[0]._id, label: selectedEvent.menus[0].name } : { name: '', value: '' });

  // const [storeList, setStoreList] = useState({});
  // const [groupList, setGroupList] = useState({});
  // const [datesSelected, setDatesSelected] = useState();
  // const [datesSelectedCount, setDatesSelectedCount] = useState(0);

  // console.log(dispatchParams);

  // const defaultValues = {
  //   status: { value: 'active', label: 'Active' },
  // };
  const {
    register, errors, handleSubmit, control,
  } = useForm();

  const [picker, setPicker] = useState();

  // ** Adds New Event
  const handleFilterOrders = async (data) => {
    const filteredDispatch = {
      // orderNumber: data.orderNumber || '',
      status: selectedStatus.value || '',
      group: selectedGroup.value || '',
      dateRange: picker ? [moment(new Date(picker[0]), 'DD/MM/YYYY', true).format(), moment(new Date(picker[1]), 'DD/MM/YYYY', true).add(1, 'days').format()] : '',
    };

    await setDispatchParams({
      ...dispatchParams,
      ...filteredDispatch,
    });
    await dispatch(fetchEvents({
      ...dispatchParams,
      ...filteredDispatch,
    }));
    handleFilterSidebar();
  };

  // ** Clear Filters
  const handleClear = async () => {
    await setPicker();
    await setSelectedGroup({});
    await setSelectedStatus({});
    await setDispatchParams({});
    await dispatch(fetchEvents());
    handleFilterSidebar();
  };

  // ** Reset Input Values on Close
  // const handleResetInputValues = () => {
  //   dispatch(selectEvent({}));
  // };

  // ** Close BTN
  const CloseBtn = <X className="cursor-pointer" size={15} onClick={handleFilterSidebar} />;

  // ** Get data on mount
  useEffect(() => {
    dispatch(getGroups());
    if (groups) {
      setGroupList(groups.data.map((obj) => (obj.emailVerified ? { value: obj._id, label: `${obj.companyName}` } : { value: obj._id, label: `${obj.companyName} (not verified)`, isDisabled: true })));
    }
  }, [dispatch, setGroupList, groups.data.length, errors]);

  return (
    <Modal
      isOpen={open}
      toggle={handleFilterSidebar}
      className="sidebar-lg"
      contentClassName="p-0"
      // onOpened={handleSelectedEvent}
      // onClosed={handleResetInputValues}
      modalClassName="modal-slide-in event-sidebar"
    >
      <ModalHeader className="mb-0" toggle={handleFilterSidebar} close={CloseBtn} tag="div">
        <h5 className="modal-title">
          Filter
        </h5>
      </ModalHeader>
      <ModalBody className="flex-grow-1 pb-sm-0 pb-3">
        <Form
          onSubmit={handleSubmit((data) => {
            if (isObjEmpty(errors)) {
              handleFilterOrders(data);
              // if (isObjEmpty(selectedEvent) || (!isObjEmpty(selectedEvent) && !selectedEvent.title.length)) {

              // } else {
              //   // handleUpdateEvent();
              // }
            }
          })}
        >
          <FormGroup>
            <Label for="dates" className="d-flex">
              Event date
            </Label>
            <div className={`d-flex align-items-center ${classnames({ 'is-invalid': errors.dates })}`}>
              <Flatpickr
                value={picker}
                id="range-picker"
                className="form-control"
                onChange={(date) => setPicker(date)}
                options={{
                  mode: 'range',
                }}
              />
              <Calendar size={22} className="ml-1" />
            </div>
          </FormGroup>

          <FormGroup>
            <Label className="form-label d-flex justify-content-between" for="store">
              Status
            </Label>
            <Select
              options={statusOptions}
              name="status"
              defaultValue={selectedStatus}
              className={`react-select ${classnames({ 'is-invalid': errors.status })}`}
              classNamePrefix="select"
              onChange={(value) => { setSelectedStatus(value); }}
            />
          </FormGroup>

          <FormGroup>
            <Label className="form-label d-flex justify-content-between" for="group">School</Label>
            <Select
              as={Select}
              options={groupList}
              name="group"
              defaultValue={selectedGroup}
              isClearable={false}
              control={control}
              className={`react-select ${classnames({ 'is-invalid': errors.group })}`}
              classNamePrefix="select"
              onChange={(value) => { setSelectedGroup(value); }}
            />
          </FormGroup>

          <div className="mt-3">
            <hr />
            <Button.Ripple className="mr-2" type="submit" color="primary">
              Filter
            </Button.Ripple>
            <Button.Ripple color="secondary" type="reset" onClick={handleClear} outline>
              Clear
            </Button.Ripple>
          </div>

        </Form>
      </ModalBody>

    </Modal>
  );
};

export default AddEventSidebar;
