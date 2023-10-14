// ** React Imports
import { useState } from 'react';

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux';

import { getOrder, updateOrder } from '@store/actions/order.actions';

//* * Components
import { DisplayStatus } from '@src/components/DisplayStatus';
import DataTable from 'react-data-table-component';

// ** Third Party Components
import {
  Alert,
  Badge,
  Card,
  CardBody,
  CardText,
  Row,
  Col,
  FormGroup,
  Label,
  Button,
} from 'reactstrap';

import UILoader from '@components/ui-loader';
import Select from 'react-select';
import { Plus } from 'react-feather';

// ** Utils
import {
  getDeliveryDate, getCutOffDate, priceFormatter, calculateOrderTotals,
} from '@utils';
import { cartQtyOptions, qtySelectStyles } from '@src/models/constants/qtyOptions';
import { columns } from './columns';

// ** Styles
import 'react-slidedown/lib/slidedown.css';
import '@styles/react/libs/flatpickr/flatpickr.scss';
import '@styles/base/pages/app-invoice.scss';

const OrderEditCard = ({ selectedEvent }) => {
  const dispatch = useDispatch();

  // ** States
  // const order = useSelector((state) => state.orders.selectedOrder);

  // ** States
  const [count, setCount] = useState(1);
  const [isProcessing, setProcessing] = useState(false);

  // const [picker, setPicker] = useState();
  // const [dueDatepicker, setDueDatePicker] = useState();

  // const profile = order.profile[0];
  // const { event, orderLines } = order;
  const { group, store, orders } = selectedEvent;
  // const orderTotals = order.orderTotals[0];

  // const handleQtyChange = async (selectedQty, orderLine, currentOrder) => {
  //   setProcessing(true);

  //   // get index of orderLine
  //   const orderLineIndex = currentOrder.orderLines.findIndex((x) => x === orderLine);

  //   if (selectedQty.value === 0) {
  //     delete currentOrder.orderLines[orderLineIndex];
  //   } else {
  //     currentOrder.orderLines[orderLineIndex].qty = selectedQty.value;
  //   }
  //   const orderLines = currentOrder.orderLines.filter((x) => x != null);

  //   // Update Order
  //   try {
  //     const orderTotals = await calculateOrderTotals(currentOrder);
  //     await dispatch(updateOrder(currentOrder._id, { orderLines, orderTotals }));
  //     await dispatch(getOrder(currentOrder.orderNumber));
  //     setProcessing(false);
  //   } catch (err) {
  //     // eslint-disable-next-line no-console
  //     console.log('ERROR', err);
  //     setProcessing(false);
  //   }
  // };

  // ** Deletes form
  // const deleteForm = (e) => {
  //   e.preventDefault();
  //   e.target.closest('.repeater-wrapper').remove();
  // };

  // ** Render order lines
  // const renderOrderLines = () => orderLines.map((orderLine, i) => {
  //   const optionsSelected = orderLine.options.map((x) => x.optionsSelected.map((x) => (x.price ? ` ${x.name} (+$${x.price})` : ` ${x.name}`)));

  //   return (
  //     <li key={`orderLine-${i}`} className="order-item d-flex justify-content-between">
  //       <div className="detail-title">
  //         <div className="d-flex">

  //           <Select
  //             styles={qtySelectStyles}
  //             className="react-select"
  //             defaultValue={cartQtyOptions[orderLine.qty]}
  //             options={cartQtyOptions}
  //             isClearable={false}
  //             components={{
  //               IndicatorSeparator: () => null,
  //             }}
  //             onChange={(e) => {
  //               handleQtyChange(e, orderLine, order);
  //             }}
  //             menuPortalTarget={document.body}
  //             menuPosition="absolute"
  //             menuShouldScrollIntoView={false}
  //           />

  //           <div className="ml-1 image">
  //             <img className="" src={orderLine.image} alt={orderLine.name} />
  //           </div>
  //           <div className="ml-1 description">
  //             <div className="">
  //               {orderLine ? orderLine.name : ''}
  //             </div>
  //             <small className="text-muted d-block mt-0">{optionsSelected.toString()}</small>
  //           </div>
  //         </div>

  //       </div>
  //       <div className="detail-amt">
  //         {orderLine ? priceFormatter(orderLine.qty * orderLine.subtotal) : ''}
  //         {/* {priceFormatter(lineSubTotal)} */}
  //       </div>
  //     </li>
  //   );
  // });

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
