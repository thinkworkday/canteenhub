// ** React Imports
import { useEffect, useState, Fragment } from 'react';

// ** API
import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';

// ** Third Party Components
import {
  Row, Col, Card, CardHeader, CardTitle, CardBody, Nav, NavItem, NavLink,
} from 'reactstrap';

// ** Utils
import moment from 'moment';
// import { priceFormatter } from '@utils';

// ** Charts
import BarChart from './recharts/BarChart';
// import fetchOrderReportData from '../../utility/reports/fetchOrderReportData';

// ** Styles
// import '@styles/react/libs/flatpickr/flatpickr.scss';
import '@styles/react/libs/charts/recharts.scss';

const ChartOrdersBar = (props) => {
  const [reportFormat, setReportFormat] = useState('30 days');
  const [orderReportData, setOrderReportData] = useState([]);

  const type = props.type ? props.type : 'orders';

  // build the chart data (last 30 days)
  const build30DayReport = async (data) => {
    const formattedReportData = data.map((obj) => ({ date: moment(new Date(obj.groupedDate)).format('D MMM'), revenue: obj.totalAmount, orders: obj.totalOrders }));

    const lastThirtyDays = [...new Array(30)].map((i, idx) => {
      const formattedDate = moment().startOf('day').subtract(idx, 'days').format('D MMM');
      const exists = formattedReportData.find((k) => k.date === formattedDate);
      return (exists || { date: formattedDate });
    });
    return (lastThirtyDays.reverse());
  };

  // build the chart data (last 12 mths)
  const build12MthReport = async (data) => {
    const formattedReportData = data.map((obj) => ({ date: `${moment.monthsShort(obj._id.month - 1)} ${obj._id.year}`, revenue: obj.totalAmount, orders: obj.totalOrders }));
    const last12Mths = [...new Array(12)].map((i, idx) => {
      const formattedDate = moment().startOf('month').subtract(idx, 'months').format('MMM YYYY');
      const exists = formattedReportData.find((k) => k.date === formattedDate);
      return (exists || { date: formattedDate });
    });
    return (last12Mths.reverse());
  };

  useEffect(() => {
    async function fetchOrderReportData() {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/reports/orders/`, { headers });
      const reportData = reportFormat === '30 days' ? await build30DayReport(response.data[0].dailySummary) : await build12MthReport(response.data[0].monthlySummary);
      setOrderReportData(reportData);
    }
    fetchOrderReportData();
  }, [reportFormat]);

  return (
    <>
      <Row className="match-height">
        <Col sm="12">

          <Card>

            <CardHeader>
              <div>
                <CardTitle tag="h4">{type === 'revenue' ? 'Revenue' : 'Order Summary'}</CardTitle>
                <small className="text-muted">
                  Total
                  {' '}
                  {type === 'revenue' ? 'revenue' : 'orders'}
                  {' '}
                  for past
                  {' '}
                  {reportFormat}
                </small>
              </div>
              {/* <div className="d-flex align-items-center flex-wrap mt-sm-0 mt-1">
                <h5 className="font-weight-bold mb-0 mr-1">$ 100,000</h5>
                <Badge className="badge-md" color="light-secondary">
                  <ArrowDown className="text-danger mr-50" size={15} />
                  20%
                </Badge>
              </div> */}

              <Nav className="justify-content-end" tabs>
                <NavItem>
                  <NavLink
                    active={reportFormat === '30 days'}
                    onClick={() => {
                      setReportFormat('30 days');
                    }}
                  >
                    30 days
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    active={reportFormat === '12 mths'}
                    onClick={() => {
                      setReportFormat('12 mths');
                    }}
                  >
                    12 mths
                  </NavLink>
                </NavItem>
              </Nav>

            </CardHeader>

            <CardBody>
              {/* <div className="d-flex align-items-center flex-wrap mb-2">
                <div className="mr-1">
                  <span className="bullet bullet-sm bullet-bordered mr-50" style={{ backgroundColor: '#826af9' }} />
                  <span className="align-middle mr-75">Apple</span>
                </div>
                <div className="mr-1">
                  <span className="bullet bullet-sm bullet-bordered mr-50" style={{ backgroundColor: '#9f87ff' }} />
                  <span className="align-middle mr-75">Samsung</span>
                </div>
                <div className="mr-1">
                  <span className="bullet bullet-sm bullet-bordered mr-50" style={{ backgroundColor: '#d2b0ff' }} />
                  <span className="align-middle mr-75">Oneplus</span>
                </div>
                <div>
                  <span className="bullet bullet-sm bullet-bordered mr-50" style={{ backgroundColor: '#f8d3ff' }} />
                  <span className="align-middle">Motorola</span>
                </div>
              </div> */}
              <BarChart data={orderReportData} type={type} />
            </CardBody>
          </Card>

        </Col>
      </Row>
    </>
  );
};

export default ChartOrdersBar;
