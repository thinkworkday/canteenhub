// ** React Imports
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux';
import { getCustomerTransaction } from '@store/actions/payment.actions';

// ** Third Party Components
// import axios from 'axios';
import {
  Alert, Row, Col, Button,
} from 'reactstrap';

// ** Invoice Edit Components
import TransactionHeader from './TransactionHeader';
import TransactionOrderTable from './TransactionOrderTable';

const TransactionDetail = () => {
  // ** Vars
  const { transactionId } = useParams();
  const dispatch = useDispatch();

  // ** States
  const selectedTransaction = useSelector((state) => (state.transactions.selectedTransaction ? state.transactions.selectedTransaction[0] : null));

  // ** Get invoice on mount based on id
  useEffect(() => {
    dispatch(getCustomerTransaction(transactionId));
  }, []);

  return selectedTransaction !== null && selectedTransaction !== undefined && selectedTransaction._id !== undefined ? (
    <div className="invoice-edit-wrapper ">
      <Row className="invoice-edit">
        <Col sm={9}>
          <div className="table-header d-flex justify-content-between align-items-bottom">
            <Button.Ripple color="flat-light" onClick={() => window.history.back()}>
              &lt; back to list
            </Button.Ripple>
          </div>
        </Col>
        <Col lg={3} />
      </Row>

      <Row className="invoice-edit">
        <Col xl={9} md={8} sm={12}>
          <TransactionHeader transaction={selectedTransaction} />
          <TransactionOrderTable transactionId={selectedTransaction} />
        </Col>
      </Row>
    </div>
  ) : (
    <Alert color="danger">
      <div className="alert-body">
        Transaction does not exist, or you do not have permission to view order:
        {' #'}
        {transactionId}
      </div>
    </Alert>
  );
};

export default TransactionDetail;
