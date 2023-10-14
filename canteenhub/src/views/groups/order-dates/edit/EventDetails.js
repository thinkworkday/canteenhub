// ** React Imports
import { useState } from 'react';

// ** Store & Actions

//* * Components
import { DateItem } from '@src/components/DateItem';
import { DisplayStatus } from '@src/components/DisplayStatus';

// ** Third Party Components
import {
  Card,
  CardBody,
  Row,
} from 'reactstrap';

import UILoader from '@components/ui-loader';

// ** Utils
import {
  getCutOffDate, getDeliveryDate,
} from '@utils';

// ** Styles
import 'react-slidedown/lib/slidedown.css';
import '@styles/react/libs/flatpickr/flatpickr.scss';
import '@styles/base/pages/app-invoice.scss';

const OrderEditCard = ({ selectedEvent }) => {
  // ** States
  const [isProcessing, setProcessing] = useState(false);
  const menu = (selectedEvent.menus && selectedEvent.menus[0]) ? selectedEvent.menus[0] : selectedEvent.menuDefault[0];

  return (

    <Card className="invoice-preview-card">
      <UILoader blocking={isProcessing}>
        <CardBody className="invoice-padding pt-2 pb-2">

          <Row className="align-items-center w-100">
            <DateItem date={selectedEvent.date} />
            <div className="w-75">
              <h4 className="mb-0">{selectedEvent.title}</h4>
              <small className="d-block">
                {selectedEvent.store?.storeName}
              </small>

              <div>
                <small className="text-muted mr-1">
                  Delivery:
                  {' '}
                  {getDeliveryDate(selectedEvent.date, selectedEvent.deliveryTime)}
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
              <small className="d-block text-muted mr-1">
                Menu:
                {' '}
                <a href={`/group/menus/view/${menu._id}`}><small>{menu.name}</small></a>
              </small>

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
