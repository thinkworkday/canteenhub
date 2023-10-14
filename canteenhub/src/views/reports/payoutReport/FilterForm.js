/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-plusplus */
// ** React Imports
import { useState, useEffect } from 'react';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';
import { getStores } from '@store/actions/vendor.actions';
import { getGroups } from '@store/actions/group.actions';
import { getUsers } from '@store/actions/user.actions';

// ** API
import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';

// ** Utils
import { isObjEmpty, getLoggedUser } from '@utils';

// ** Custom Components

// ** Third Party Components
import moment from 'moment';
import classnames from 'classnames';
import Flatpickr from 'react-flatpickr';
import {
  Calendar,
} from 'react-feather';
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import {
  Button, FormGroup, Label, Form,
} from 'reactstrap';
// import NumberInput from '@components/number-input';

// ** Styles Imports
import '@styles/react/libs/react-select/_react-select.scss';
import '@styles/react/libs/flatpickr/flatpickr.scss';

const AddEventSidebar = (props) => {
  const loggedUser = getLoggedUser();

  // ** Props
  const {
    setOrderReportData, setIsLoading,
  } = props;

  const dispatch = useDispatch();

  // ** Vars
  const vendors = useSelector((state) => state.users);
  const stores = useSelector((state) => state.stores);
  const groups = useSelector((state) => state.groups);

  const {
    errors, handleSubmit, control,
  } = useForm();

  // ** States
  const [selectedVendor, setSelectedVendor] = useState({});
  const [selectedStore, setSelectedStore] = useState({});
  const [selectedGroup, setSelectedGroup] = useState({});
  const [vendorList, setVendorList] = useState({});
  const [storeList, setStoreList] = useState({});
  const [groupList, setGroupList] = useState({});

  const [picker, setPicker] = useState();

  // ** Handle Filter
  const handleFilter = async () => {
    setIsLoading(true);
    const params = {
      dateRange: picker ? [moment(new Date(picker[0]), 'DD/MM/YYYY', true).format('YYYY-MM-DD[T00:00:00.000Z]'), moment(new Date(picker[1]), 'DD/MM/YYYY', true).format('YYYY-MM-DD[T23:59:59.000Z]')] : '',
      vendor: selectedVendor.value || '',
      group: selectedGroup.value || '',
      store: selectedStore.value || '',
    };

    await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/reports/payoutReport/`, { params, headers }).then((response) => {
      setOrderReportData(response.data);
      setIsLoading(false);
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      setIsLoading(false);
      throw err;
    });
  };

  // ** Clear Filters
  const handleClear = async () => {
    await setPicker();
    await setSelectedGroup({});
    await setSelectedVendor({});
    await setOrderReportData([]);
  };

  // ** Get data on mount
  useEffect(() => {
    dispatch(getGroups());
    if (groups) {
      setGroupList(groups.data.map((obj) => (obj.emailVerified ? { value: obj._id, label: `${obj.companyName}` } : { value: obj._id, label: `${obj.companyName} (not verified)`, isDisabled: true })));
    }

    if (loggedUser.role === 'admin') {
      dispatch(getUsers({ role: 'vendor' }));
      if (vendors) {
        setVendorList(vendors.data.map((obj) => ({ value: obj._id, label: `${obj.companyName}` })));
      }
    }

    dispatch(getStores());
    if (stores) {
      setStoreList(stores.data.map((obj) => ({ value: obj._id, label: `${obj.storeName}` })));
    }
  }, [dispatch, setVendorList, vendors.data.length, setGroupList, groups.data.length, setStoreList, stores.data.length, errors]);

  return (
    <div>
      <h5 className="modal-title mb-2">
        Filter
      </h5>

      <Form
        onSubmit={handleSubmit((data) => {
          if (isObjEmpty(errors)) {
            handleFilter(data);
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
              onChange={(date) => { setPicker(date); }}
              options={{
                mode: 'range',
                // maxDate: 'today',
              }}
            />
            <Calendar size={22} className="ml-1" />
          </div>
        </FormGroup>
        {loggedUser.role === 'admin' ? (
          <FormGroup>
            <Label className="form-label d-flex justify-content-between" for="vendor">Vendor</Label>
            <Select
              as={Select}
              options={vendorList}
              name="store"
              value={selectedVendor}
              isClearable={false}
              control={control}
              className={`react-select ${classnames({ 'is-invalid': errors.group })}`}
              classNamePrefix="select"
              onChange={(value) => { setSelectedVendor(value); }}
            />
          </FormGroup>
        ) : (
          <>
            <FormGroup>
              <Label className="form-label d-flex justify-content-between" for="group">Store</Label>
              <Select
                as={Select}
                options={storeList}
                name="store"
                value={selectedStore}
                isClearable={false}
                control={control}
                className={`react-select ${classnames({ 'is-invalid': errors.group })}`}
                classNamePrefix="select"
                onChange={(value) => { setSelectedStore(value); }}
              />
            </FormGroup>
            <FormGroup>
              <Label className="form-label d-flex justify-content-between" for="group">Group / School</Label>
              <Select
                as={Select}
                options={groupList}
                name="group"
                value={selectedGroup}
                isClearable={false}
                control={control}
                className={`react-select ${classnames({ 'is-invalid': errors.group })}`}
                classNamePrefix="select"
                onChange={(value) => { setSelectedGroup(value); }}
              />
            </FormGroup>
          </>
        ) }

        <div className="mt-3">
          <Button.Ripple className="mr-2" type="submit" color="primary">
            Filter
          </Button.Ripple>
          <Button.Ripple color="secondary" type="reset" onClick={handleClear} outline>
            Clear
          </Button.Ripple>
        </div>

      </Form>

    </div>
  );
};

export default AddEventSidebar;
