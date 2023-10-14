// ** React Imports
// import { useState, useEffect } from 'react';

// ** Store & Actions
import { useSelector } from 'react-redux';
// import { getCustomerTransaction } from '@store/actions/payment.actions';

//* * Components
import DataTable from 'react-data-table-component';

// ** Third Party Components
import {
  Alert,
  Card,
  CardBody,
} from 'reactstrap';

// import UILoader from '@components/ui-loader';

// ** Utils
import { columns } from './columns';

// ** Styles
import 'react-slidedown/lib/slidedown.css';
import '@styles/react/libs/flatpickr/flatpickr.scss';
import '@styles/base/pages/app-invoice.scss';

const TransactionOrders = () => {
  // const dispatch = useDispatch();

  // ** States
  const transaction = useSelector((state) => state.transactions.selectedTransaction);

  // ** States
  // const [use, setProcessing] = useState(false);

  // ** Get data on mount
  // useEffect(() => {
  //   console.log('Use effect');
  //   // dispatch(getCustomerTransaction(transactionId));
  // }, []);

  return (
    <Card className="invoice-preview-card mb-0">
      {/* <UILoader> */}
      <CardBody className="invoice-padding pt-3 pb-0">
        <h4>
          Orders
          {transaction[0].orders.length > 0 ? `(${transaction[0].orders.length})` : ''}
        </h4>
      </CardBody>
      {/* /Header */}

      <hr className="invoice-spacing" />

      {/* Address and Contact */}
      <CardBody className="invoice-padding pt-0">

        {transaction[0].orders.length > 0 ? (
          <DataTable
            data={transaction[0].orders}
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

      {/* </UILoader> */}
    </Card>
  );
};

export default TransactionOrders;
