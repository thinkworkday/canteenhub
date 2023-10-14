// ** Third Party Components
import {
  Card, CardBody, Row, Col, Table,
} from 'reactstrap';

// ** Utils
import { formatDate, priceFormatter } from '@utils';

// ** Styles
const OrderEditCard = ({ transaction }) => (
  <Card className="invoice-preview-card mb-2">
    <CardBody className="invoice-padding pt-3 ">
      <Row className="invoice-spacing justify-content-between">
        <Col className="" lg="4">
          <h2 className="mb-2">
            Transaction
          </h2>
        </Col>
        <Col className=" mt-xl-0 mt-2" lg="4">
          <Table borderless responsive>
            <tbody>
              <tr>
                <td className="pr-1">ID:</td>
                <td>
                  <span className="font-weight-bold">{transaction._id}</span>
                </td>
              </tr>
              <tr>
                <td className="pr-1">Date:</td>
                <td>{formatDate(transaction.createdAt)}</td>
              </tr>
              <tr>
                <td className="pr-1">Subtotal:</td>
                <td>{transaction.transactionData.late_fees ? priceFormatter(transaction.transactionData.transaction_total - transaction.transactionData.transaction_fees - transaction.transactionData.late_fees) : priceFormatter(transaction.transactionData.transaction_total - transaction.transactionData.transaction_fees)}</td>
              </tr>
              <tr>
                <td className="pr-1">Fees:</td>
                <td>{transaction.transactionData.late_fees ? priceFormatter(transaction.transactionData.transaction_fees + transaction.transactionData.late_fees) : priceFormatter(transaction.transactionData.transaction_fees)}</td>
              </tr>
              <tr>
                <td className="pr-1">Amount Paid:</td>
                <td>
                  {priceFormatter(transaction.transactionData.transaction_total)}
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </CardBody>
  </Card>
);
export default OrderEditCard;
