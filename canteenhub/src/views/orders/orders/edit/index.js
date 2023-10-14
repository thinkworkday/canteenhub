// ** React Imports
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux';
import { getOrder } from '@store/actions/order.actions';

// ** Third Party Components
// import axios from 'axios';
import { Alert, Row, Col } from 'reactstrap';

// ** Invoice Edit Components
import EditCard from './EditCard';
import EditActions from './EditActions';
// import SendInvoiceSidebar from '../shared-sidebar/SidebarSendInvoice';
// import AddPaymentSidebar from '../shared-sidebar/SidebarAddPayment';

const InvoiceEdit = () => {
  // ** Vars
  const { orderNumber } = useParams();
  const dispatch = useDispatch();

  // ** States
  const selectedOrder = useSelector((state) => state.orders.selectedOrder);

  // const [data, setData] = useState(null);
  // const [sendSidebarOpen, setSendSidebarOpen] = useState(false);
  // const [addPaymentOpen, setAddPaymentOpen] = useState(false);

  // ** Functions to toggle add & send sidebar
  // const toggleSendSidebar = () => setSendSidebarOpen(!sendSidebarOpen);
  // const toggleAddSidebar = () => setAddPaymentOpen(!addPaymentOpen);

  // console.log(selectedOrder.orderLines.length);

  // ** Get invoice on mount based on id
  useEffect(() => {
    dispatch(getOrder(orderNumber));
    // console.log(process.env.REACT_APP_SERVER_URL);
    // axios.get(`${process.env.REACT_APP_SERVER_URL}/api/orders/${orderNumber}`).then((response) => {
    //   console.log(data);
    //   setData(response.data);
    // });
  }, []);

  return selectedOrder !== null && selectedOrder.orderNumber !== undefined ? (
    <div className="invoice-edit-wrapper ">
      <Row className="invoice-edit">
        <Col xl={9} md={8} sm={12}>
          <EditCard order={selectedOrder} />
        </Col>
        <Col xl={3} md={4} sm={12}>
          <EditActions order={selectedOrder} />
        </Col>
      </Row>
      {/* <SendInvoiceSidebar toggleSidebar={toggleSendSidebar} open={sendSidebarOpen} /> */}
      {/* <AddPaymentSidebar toggleSidebar={toggleAddSidebar} open={addPaymentOpen} /> */}
    </div>
  ) : (
    <Alert color="danger">
      <div className="alert-body">
        Order does not exist, or you do not have permission to view order:
        {' #'}
        {orderNumber}
      </div>
    </Alert>
  );
};

export default InvoiceEdit;
