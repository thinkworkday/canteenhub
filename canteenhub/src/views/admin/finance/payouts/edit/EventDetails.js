// ** React Imports
import { useState } from 'react';
import { useForm } from 'react-hook-form';

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux';
// import { updateEvent, fetchEvent } from '@store/actions/event.actions';
// import { getStores } from '@store/actions/vendor.actions';

// import moment from 'moment';

//* * Components
import { DateItem } from '@src/components/DateItem';
import { DisplayStatus } from '@src/components/DisplayStatus';

// import { toast } from 'react-toastify';
// import Flatpickr from 'react-flatpickr';

// ** Third Party Components
import {
  Card,
  CardBody,
  Row,
  Col,
  FormGroup,
  CardText,
} from 'reactstrap';

import UILoader from '@components/ui-loader';
// import Select from 'react-select';
// import { Plus, Calendar } from 'react-feather';
// import classnames from 'classnames';

// ** Utils
import {
  getCutOffDate, getDeliveryDate,
} from '@utils';

// ** Styles
import 'react-slidedown/lib/slidedown.css';
import '@styles/react/libs/flatpickr/flatpickr.scss';
import '@styles/base/pages/app-invoice.scss';

const OrderEditCard = ({ selectedEvent }) => {
  // const dispatch = useDispatch();

  // ** States
  const [isProcessing, setProcessing] = useState(false);

  return (

    <Card className="invoice-preview-card">
      <UILoader blocking={isProcessing}>
        <CardBody className="invoice-padding pt-2 pb-2">

          <Row className="align-items-center w-100">
            <DateItem date={selectedEvent.date} />
            <div className="w-50">
              <h4 className="mb-0">{selectedEvent.title}</h4>
              <small className="d-block">
                {selectedEvent.store?.storeName}
              </small>

              <div>
                <small className="text-muted mr-1">
                  Delivery:
                  {' '}
                  {selectedEvent.deliveryTime}
                </small>
                <small className="text-muted">
                  |
                </small>
                <small className="text-muted ml-1 mr-1">
                  Cutoff:
                  {' '}
                  {getCutOffDate(getDeliveryDate(selectedEvent.date, selectedEvent.deliveryTime), selectedEvent.cutoffPeriod)}
                </small>
              </div>
            </div>
            <div className="ml-auto ">
              <DisplayStatus status={selectedEvent.status} />
            </div>

          </Row>

        </CardBody>
        {/* /Header */}

      </UILoader>
    </Card>

  );
};

export default OrderEditCard;
