/* eslint-disable jsx-a11y/anchor-is-valid */
// ** React Imports
import { Fragment, useState } from 'react';

// ** Third Party Components
import {
  DollarSign, Package, Clock, RefreshCcw,
} from 'react-feather';
// import * as Icon from 'react-feather';

import {
  Alert, Card, CardBody, Row, Col, CardHeader, CardTitle, Table,
} from 'reactstrap';

// import { CSVLink } from 'react-csv';
// import moment from 'moment';
import {
  priceFormatter, formatDate, fetchCommission, getLoggedUser,
} from '@utils';
// import { columns } from './columns';

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss';
import '@styles/react/libs/tables/react-dataTable-component.scss';

// ** Custom Components
import UILoader from '@components/ui-loader';
import StatsCard from '../components/StatsCard';
import FilterForm from './FilterForm';

// ** Constants
const OrdersList = () => {
  // ** Store Vars

  // ** States
  const [orderReportData, setOrderReportData] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // const [csvData, setCsvData] = useState();

  // ** Configure Stats Bar
  let statBarData;
  if (orderReportData && orderReportData.length > 0) {
    const {
      active, fulfilled, refunded,
    } = orderReportData[0];

    statBarData = [
      {
        title: fulfilled.reduce((previousValue, currentValue) => previousValue + currentValue.ordersSummary.count, 0) + active.reduce((previousValue, currentValue) => previousValue + currentValue.ordersSummary.count, 0) + refunded.reduce((previousValue, currentValue) => previousValue + currentValue.ordersSummary.count, 0),
        subtitle: 'Orders',
        color: 'light-secondary',
        icon: <Package size={24} />,
      },
      {
        title: priceFormatter(active[0] ? active.reduce((previousValue, currentValue) => previousValue + currentValue.ordersSummary.orderSubtotal, 0) : 0),
        subtitle: 'Pending',
        color: 'light-info',
        icon: <Clock size={24} />,
      },
      {
        title: priceFormatter(refunded[0] ? refunded.reduce((previousValue, currentValue) => previousValue + currentValue.ordersSummary.orderSubtotal, 0) : 0),
        subtitle: 'Refunded',
        color: 'light-danger',
        icon: <RefreshCcw size={24} />,
      },
      {
        title: priceFormatter(fulfilled[0] ? (fulfilled.reduce((total, current) => total + current.payoutSummary.reduce((total, current) => total + current.totalPayout, 0), 0)) : 0),
        subtitle: 'Total Payout',
        color: 'light-success',
        icon: <DollarSign size={24} />,
      },
    ];
  }

  const TableReport = ({
    reportData, title, totalTitle, type,
  }) => {
    if (!reportData || !reportData[0]) return false;

    return (
      <Card>
        <CardBody>
          <Card className="card-transaction">
            <CardHeader>
              <CardTitle tag="h4">{title}</CardTitle>
              {/* <Icon.MoreVertical size={18} className="cursor-pointer" /> */}
            </CardHeader>
            <CardBody>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Event</th>
                    <th className="text-right">Orders</th>
                    <th className="text-right">Total (inc. GST)</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    reportData.map((row, index) => (
                      <tr key={`fulfilled${index}`}>
                        <td>
                          <span className="d-block align-middle fw-bold">
                            {row.title}
                          </span>
                          <span className="d-block align-middle fw-bold">
                            <small className="d-block">{formatDate(row.date)}</small>
                          </span>
                        </td>
                        <td align="right">{row.ordersSummary.count}</td>
                        <td align="right">
                          {priceFormatter(row.ordersSummary.orderTotal)}
                        </td>
                      </tr>
                    ))
                  }
                  <tr className="table-active">
                    <td>
                      <strong>Total</strong>
                    </td>
                    <td align="right">{reportData.reduce((previousValue, currentValue) => previousValue + currentValue.ordersSummary.count, 0)}</td>
                    <td align="right">
                      {priceFormatter(reportData.reduce((previousValue, currentValue) => previousValue + currentValue.ordersSummary.orderTotal, 0))}
                    </td>
                  </tr>
                  <tr>
                    <td>&nbsp;</td>
                    <td align="right">
                      Customer Transaction Fees
                    </td>
                    <td align="right" className="">
                      -
                      {priceFormatter(reportData.reduce((previousValue, currentValue) => previousValue + currentValue.ordersSummary.orderFees, 0))}
                    </td>
                  </tr>
                  <tr>
                    <td>&nbsp;</td>
                    <td align="right">
                      Total Sales
                    </td>
                    <td align="right">
                      {priceFormatter(reportData.reduce((previousValue, currentValue) => previousValue + currentValue.ordersSummary.orderSubtotal, 0))}
                    </td>
                  </tr>

                  {type !== 'refunded' ? (
                    <>
                      {type === 'fulfilled' ? (
                        <tr>
                          <td>&nbsp;</td>
                          <td align="right">
                            Canteen Hub Fees
                          </td>
                          <td align="right">
                            -
                            { priceFormatter(reportData.reduce((total, current) => total + current.payoutSummary.reduce((total, current) => total + current.totalCommission, 0), 0)) }
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td>&nbsp;</td>
                          <td align="right">
                            Canteen Hub Fees
                          </td>
                          <td align="right">
                            -
                            { priceFormatter(fetchCommission(reportData.reduce((previousValue, currentValue) => previousValue + currentValue.ordersSummary.orderSubtotal, 0), selectedVendor || getLoggedUser())) }
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td>&nbsp;</td>
                        <td align="right">
                          Donations
                        </td>
                        <td align="right">
                          -
                          {priceFormatter(reportData.reduce((previousValue, currentValue) => previousValue + currentValue.ordersSummary.orderDonation, 0))}
                        </td>
                      </tr>
                      <tr>
                        <td>&nbsp;</td>
                        <td align="right">
                          <strong>{totalTitle}</strong>
                        </td>
                        <td align="right">
                          <strong>
                            {
                      // eslint-disable-next-line multiline-ternary
                      type === 'fulfilled'
                        ? priceFormatter(reportData.reduce((total, current) => total + current.payoutSummary.reduce((total, current) => total + current.totalPayout, 0), 0)) : priceFormatter(reportData.reduce((previousValue, currentValue) => previousValue + currentValue.ordersSummary.orderSubtotal, 0) - fetchCommission(reportData.reduce((previousValue, currentValue) => previousValue + currentValue.ordersSummary.orderSubtotal, 0), getLoggedUser()))
                      }
                          </strong>
                        </td>
                      </tr>
                    </>
                  ) : <></>}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </CardBody>
      </Card>
    );
  };

  return (
    <>
      <Row className="table-header">
        <Col>
          <h3>Payout Report</h3>
          {/* <small>Menu&#39;s can be created by both admin and vendors. Admin created menu&#39;s cannot be modified by vendors</small> */}
        </Col>
        <Col
          xl="4"
          className="text-right"
        >
          {/* <CSVLink className="waves-effect btn btn-outline-primary btn-sm" data={csvData || ''} filename={`picklist-${moment().format('YYYYMMDDHHmmss')}.csv`}>
            <Printer size={14} />
            {' '}
            Print
          </CSVLink> */}
        </Col>
      </Row>
      <UILoader blocking={isLoading}>
        <Row>
          <Col lg="4">
            <Card>
              <CardBody>
                <FilterForm
                  setOrderReportData={setOrderReportData}
                  selectedVendor={selectedVendor}
                  setSelectedVendor={setSelectedVendor}
                  setIsLoading={setIsLoading}
                />
              </CardBody>
            </Card>
          </Col>
          <Col lg="8">

            {orderReportData && orderReportData.length > 0 ? (
              <>
                <StatsCard cols={{ xl: '3', sm: '6' }} data={statBarData} />
                <TableReport reportData={orderReportData[0].fulfilled} type="fulfilled" title="Payment Calculation - Fulfilled" totalTitle="Total Payout" />
                <TableReport reportData={orderReportData[0].active} type="active" title="Paid & Pending" totalTitle="Total Pending" />
                <TableReport reportData={orderReportData[0].refunded} type="refunded" title="Refunded" totalTitle="Refunded" />
              </>
            ) : (
              <Alert color="info">
                <div className="alert-body">
                  <span>Start by using the filter form to display your payout report</span>
                </div>
              </Alert>
            )}

          </Col>
        </Row>
      </UILoader>
    </>
  );
};

export default OrdersList;
