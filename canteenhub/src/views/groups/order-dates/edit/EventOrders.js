// ** React Imports
import { useState } from 'react';

// ** Store & Actions

//* * Components
import DataTable from 'react-data-table-component';

// ** Third Party Components
import {
  Alert,
  Card,
  CardBody,
} from 'reactstrap';

import UILoader from '@components/ui-loader';

// ** Utils
import { columns } from './columns';

// ** Styles
import 'react-slidedown/lib/slidedown.css';
import '@styles/react/libs/flatpickr/flatpickr.scss';
import '@styles/base/pages/app-invoice.scss';

const OrderEditCard = ({ selectedEvent }) => {
  // const dispatch = useDispatch();

  // ** States
  // const order = useSelector((state) => state.orders.selectedOrder);

  // ** States
  const [isProcessing, setProcessing] = useState(false);
  const { orders } = selectedEvent;

  return (
    <Card className="invoice-preview-card mb-0">
      <UILoader blocking={isProcessing}>

        <CardBody className="invoice-padding pt-3 pb-0">
          <h4>
            Orders
            {orders.length > 0 ? `(${orders.length})` : ''}
          </h4>
        </CardBody>
        {/* /Header */}

        <hr className="invoice-spacing" />

        {/* Address and Contact */}
        <CardBody className="invoice-padding pt-0">

          {orders.length > 0 ? (
            <DataTable
              data={orders}
              responsive
              className="react-dataTable"
              noHeader
              pagination
            // paginationPerPage={rowsPerPage}
            // paginationRowsPerPageOptions={paginationRowsPerPageOptions}
              columns={columns()}
            />
          ) : (
            <Alert color="info">
              <div className="alert-body">
                <span>No orders for this event</span>
              </div>
            </Alert>
          ) }
        </CardBody>

      </UILoader>
    </Card>
  );
};

export default OrderEditCard;
