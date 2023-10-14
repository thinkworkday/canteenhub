// ** React Imports
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';

// ** Store & Actions
import { updateEvent, fetchEvent } from '@store/actions/event.actions';
import { getMenus } from '@store/actions/menu.actions';
import { getStores } from '@store/actions/vendor.actions';

// import format from 'date-fns/format';
// import moment from 'moment';
import moment from 'moment';

//* * Components
import { toast } from 'react-toastify';
import Flatpickr from 'react-flatpickr';

// ** Third Party Components
import {
  Card,
  CardBody,
  CardText,
  Row,
  Col,
  FormGroup,
  Label,
  Form,
  Input, InputGroup, InputGroupText,

} from 'reactstrap';

import UILoader from '@components/ui-loader';
import Select from 'react-select';
// import { Plus, Calendar } from 'react-feather';
import classnames from 'classnames';

import {
  isObjEmpty, formatDateTZ,
} from '@utils';
import timezones from '@src/assets/data/timezones';

// ** Utils

// ** Styles
import 'react-slidedown/lib/slidedown.css';
import '@styles/react/libs/flatpickr/flatpickr.scss';
import '@styles/base/pages/app-invoice.scss';

const OrderEditCard = ({ selectedEvent, setEnableSave }) => {
  const dispatch = useDispatch();

  const {
    register, errors, handleSubmit, setValue,
  } = useForm();

  // ** Store
  const stores = useSelector((state) => state.stores);
  const menus = useSelector((state) => state.menus);

  // ** States
  const [isProcessing, setProcessing] = useState(false);

  const [date, setDate] = useState(selectedEvent.date);
  const [deliveryTime, setDeliveryTime] = useState(selectedEvent.deliveryTime);
  const [selectedStore, setSelectedStore] = useState({ value: selectedEvent.store._id, label: selectedEvent.store.storeName });
  const [selectedMenu, setSelectedMenu] = useState(selectedEvent.menus && selectedEvent.menus[0] ? { value: selectedEvent.menus[0]._id, label: selectedEvent.menus[0].name } : { name: '', value: '' });

  const [storeList, setStoreList] = useState({});
  const [menuList, setMenuList] = useState({});

  const [timezoneList, setTimezoneList] = useState(timezones);
  // const [eventTimezone, setTimezone] = useState({ value: Intl.DateTimeFormat().resolvedOptions().timeZone, label: Intl.DateTimeFormat().resolvedOptions().timeZone });
  const [eventTimezone, setTimezone] = useState({ value: selectedEvent.timezone, label: selectedEvent.timezone });

  const { group, store } = selectedEvent;

  useEffect(() => {
    // set defaults
    const fields = ['title', 'cutoffPeriod'];
    fields.forEach((field) => setValue(field, selectedEvent[field]));

    dispatch(getStores());
    if (stores) {
      setStoreList(stores.data.map((obj) => ({ value: obj._id, label: `${obj.storeName}` })));
    }

    dispatch(getMenus());
    if (menus) {
      setMenuList(menus.data.map((obj) => ({ value: obj._id, label: `${obj.name}` })));
    }
  }, [selectedEvent, setStoreList, setMenuList]);

  const onSubmit = async (values) => {
    if (isObjEmpty(errors)) {
      try {
        const obj = {
          ...values,
          date,
          deliveryTime,
          timezone: eventTimezone.value,
          store: selectedStore.value,
          menus: [selectedMenu.value],
        };

        await dispatch(updateEvent(selectedEvent._id, obj));
        await dispatch(fetchEvent(selectedEvent._id));
        toast.success('Event updated');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }

    //   setProcessing(false);
    }
  };

  return (
    <Form id="formEventEdit" onSubmit={handleSubmit(onSubmit)}>

      <Card className="invoice-preview-card">
        <UILoader blocking={isProcessing}>
          <CardBody className="invoice-padding pt-2 pb-0">
            <Row className="invoice-spacing justify-content-between mb-0">
              <Col className="p-0" sm="5">
                <FormGroup row>
                  <Label sm="4" for="nameIcons">
                    Event Title:
                  </Label>
                  <Col sm="8">
                    <Input
                      type="text"
                      name="title"
                      id="title"
                      placeholder="Event Title"
                      innerRef={register({ required: true })}
                      onChange={() => setEnableSave(true)}
                      disabled={selectedEvent.status !== 'pending' && selectedEvent.status !== 'active'}
                    />
                  </Col>
                </FormGroup>
              </Col>
              <Col className="p-0" sm="5">
                <FormGroup row>
                  <Label sm="4" for="nameIcons">
                    Event Menu:
                  </Label>
                  <Col sm="8">
                    <Select
                      options={menuList}
                      name="menus"
                      defaultValue={selectedMenu}
                      className={`react-select ${classnames({ 'is-invalid': errors.menus })}`}
                      classNamePrefix="select"
                      onChange={(value) => { setSelectedMenu(value); setEnableSave(true); }}
                    />
                    {Object.keys(errors).length && errors.store ? (
                      <small className="text-danger mt-1">You must select at least one store</small>
                    ) : null}

                  </Col>
                </FormGroup>
              </Col>
            </Row>
            <Row className="invoice-spacing justify-content-between">
              <Col className="p-0" sm="5">
                <FormGroup row>
                  <Label sm="4" for="nameIcons">
                    Event Date:
                  </Label>
                  <Col sm="8">
                    <Flatpickr
                      className="form-control"
                      name="date"
                      value={selectedEvent.date}
                      onChange={([date]) => {
                        setDate(date);
                        setEnableSave(true);
                      }}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm="4" for="nameIcons">
                    Delivery Time:
                  </Label>
                  <Col sm="8">
                    <Flatpickr
                      className="form-control"
                      name="deliveryTime"
                      // disabled={selectedEvent.status !== 'pending'}
                      value={selectedEvent.deliveryTime}
                      onChange={(time) => {
                        const momentDate = moment(time[0]).toDate();
                        setDeliveryTime(moment(momentDate).format('hh:mm A'));
                        setEnableSave(true);
                      }}
                      options={{
                        enableTime: true,
                        noCalendar: true,
                        dateFormat: 'h:i K',
                      }}
                    />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm="4" for="nameIcons">
                    Event Timezone:
                  </Label>
                  <Col sm="8">
                    <Select
                      options={timezoneList}
                      name="timezone"
                      defaultValue={eventTimezone}
                      className={`react-select ${classnames({ 'is-invalid': errors.timezone })}`}
                      classNamePrefix="select"
                      onChange={(value) => {
                        setTimezone(value);
                        setEnableSave(true);
                      }}
                    />
                    {Object.keys(errors).length && errors.timezone ? (
                      <small className="text-danger mt-1">You must select a timezone in which the event will take place</small>
                    ) : null}

                  </Col>
                </FormGroup>
              </Col>

              <Col className="p-0" sm="5">
                <FormGroup row>
                  <Label sm="4" for="nameIcons">
                    Cuttoff Period:
                  </Label>
                  <Col sm="8">
                    <InputGroup>
                      <Input
                        type="number"
                        name="cutoffPeriod"
                        id="cutoffPeriod"
                        placeholder="Enter cuttoff period (in hours)"
                        // value={title}
                        innerRef={register({ required: true })}
                        onChange={() => setEnableSave(true)}
                        disabled={selectedEvent.status !== 'pending' && selectedEvent.status !== 'active'}
                      />
                      <InputGroupText>hours</InputGroupText>
                    </InputGroup>

                  </Col>
                </FormGroup>

                <FormGroup row className="align-items-center">
                  <Label sm="4" for="nameIcons">
                    Delivery Date:
                  </Label>
                  <Col sm="8">
                    {formatDateTZ(selectedEvent.deliveryDateTimeUTC, selectedEvent.timezone)}
                  </Col>
                </FormGroup>

                <FormGroup row className="align-items-center">
                  <Label sm="4" for="nameIcons">
                    Cutoff Date:
                  </Label>
                  <Col sm="8">
                    {formatDateTZ(selectedEvent.cutoffDateTimeUTC, selectedEvent.timezone)}
                  </Col>
                </FormGroup>

              </Col>
            </Row>

          </CardBody>
          {/* /Header */}

          <hr className="invoice-spacing" />

          {/* Address and Contact */}
          <CardBody className="invoice-padding pt-0">

            <Row className="invoice-spacing justify-content-between">
              <Col className="p-0" sm="5">
                <h6 className="mb-2">Group:</h6>
                <CardText className="mb-0">
                  {group ? group.companyName : ''}
                </CardText>
                <p className="mb-0">
                  Contact:
                  {' '}
                  {group.firstName ? `${group.firstName} ${group.lastName}` : 'Loading...'}
                </p>
                <p className="mb-0 text-sm">
                  {group.email ? `${group.email}` : 'Loading...'}
                </p>
                <p className="mb-0  text-sm">
                  {group.address ? `${group.address[0].formattedAddress}` : '[no address provided]'}
                </p>
              </Col>
              {/* <Col className="p-0 mt-xl-0 mt-2" lg="4"> */}
              <Col className="p-0" sm="5">
                <h6 className="mb-2">Store Details:</h6>
                { store ? (
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <FormGroup className="mb-1">
                            <Select
                              options={storeList}
                              name="store"
                              defaultValue={selectedStore}
                              className={`react-select ${classnames({ 'is-invalid': errors.store })}`}
                              classNamePrefix="select"
                              onChange={(value) => { setSelectedStore(value); setEnableSave(true); }}
                            />
                            {Object.keys(errors).length && errors.store ? (
                              <small className="text-danger mt-1">You must select at least one store</small>
                            ) : null}
                          </FormGroup>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="mb-0 text-sm">
                            e:
                            {' '}
                            {store.storeEmail ? store.storeEmail : ''}
                          </p>
                          <p className="mb-0 text-sm">
                            p:
                            {' '}
                            {store.storePhone ? store.storePhone : ''}
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : '' }
              </Col>
            </Row>
          </CardBody>
          {/* /Address and Contact */}

        </UILoader>
      </Card>

    </Form>
  );
};

export default OrderEditCard;
