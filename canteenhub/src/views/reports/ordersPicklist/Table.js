/* eslint-disable jsx-a11y/anchor-is-valid */
// ** React Imports
import { Fragment, useState, useEffect } from 'react';

// ** API
import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';

// ** Third Party Components
// import Avatar from '@components/avatar';
import {
  Download,
} from 'react-feather';
// import * as Icon from 'react-feather';

import {
  Alert, Card, CardBody, Row, Col, CardHeader, CardTitle, Media,
} from 'reactstrap';

import { CSVLink } from 'react-csv';
import moment from 'moment';
// import { priceFormatter } from '@utils';
// import { columns } from './columns';

// ** Styles
import UILoader from '@components/ui-loader';
import '@styles/react/libs/react-select/_react-select.scss';
import '@styles/react/libs/tables/react-dataTable-component.scss';

// ** Custom Components
import FilterForm from './FilterForm';

// ** Constants
const OrdersList = () => {
  // ** Store Vars

  // ** States
  const [orderReportData, setOrderReportData] = useState([]);
  const [csvData, setCsvData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // console.log(orderReportData[0].items);

  // ** Get data on mount
  useEffect(() => {
    async function fetchOrderReportData() {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/reports/orderPicklist/`, { headers });
      // const reportData = reportFormat === '30 days' ? await build30DayReport(response.data[0].dailySummary) : await build12MthReport(response.data[0].monthlySummary);
      setOrderReportData(response.data);
    }
    fetchOrderReportData();
  }, []);

  useEffect(() => {
    // dispatch(getOrders(dispatchParams));
    if (orderReportData.length > 0) {
      // console.log('orderReportData', orderReportData[0].items);
      // Configure CSV data
      const csvDataObjItems = orderReportData[0].items.map((row) => ({ item: row.item, qty: row.qty }));
      const csvDataObjOptionsObj = orderReportData[0].options.map((row) => {
        const csvDataCatAndOptions = [{ item: '', qty: '' }, { item: `Category: ${row.group}`, qty: '' }];
        const csvDataObjOptions2 = row.options.map((option) => ({ item: option.name[0], qty: option.qty })).flat();
        return (csvDataCatAndOptions.concat(csvDataObjOptions2));
      }).flat();
      const csvData = csvDataObjItems.concat(csvDataObjOptionsObj);
      setCsvData(csvData);
    }
  }, [orderReportData]);

  const renderItems = () => orderReportData[0].items.map((item, i) => (
    <div key={`item-${i}`} className="transaction-item">
      <Media>
        {/* <Avatar className="rounded" color={item.color} icon={<item.Icon size={18} />} /> */}
        <Media body>
          <p className="mb-0">{item.item}</p>
          {/* <small>{item.subtitle}</small> */}
        </Media>
      </Media>
      <div>{item.qty}</div>
    </div>
  ));

  const renderOptions = () => orderReportData[0].options.map((optionGroup, i) => (
    <Row key={`option-${i}`}>
      <Col>
        <Card className="card-transaction">
          <CardTitle tag="h4">{optionGroup.group}</CardTitle>
          {
              optionGroup.options.map((option, i2) => (
                <div key={`option-${i2}`} className="transaction-item">
                  <Media>
                    {/* <Avatar className="rounded" color={item.color} icon={<item.Icon size={18} />} /> */}
                    <Media body>
                      <p className="transaction-title mb-0">{option.name}</p>
                      {/* <small>{option.group}</small> */}
                    </Media>
                  </Media>
                  <div>{option.qty}</div>
                </div>
              ))
              }
          <hr />

        </Card>
      </Col>
    </Row>

  ));

  return (
    <>
      <Row className="table-header">
        <Col>
          <h3>Order Picklist Report</h3>
          {/* <small>Menu&#39;s can be created by both admin and vendors. Admin created menu&#39;s cannot be modified by vendors</small> */}
        </Col>
        <Col
          xl="4"
          className="text-right"
        >
          <CSVLink className="waves-effect btn btn-outline-primary btn-sm" data={csvData || ''} filename={`picklist-${moment().format('YYYYMMDDHHmmss')}.csv`}>
            <Download size={14} />
            {' '}
            CSV Export
          </CSVLink>
        </Col>
      </Row>
      <UILoader blocking={isLoading}>
        <Row>
          <Col lg="4">
            <Card>
              <CardBody>
                <FilterForm
                  setOrderReportData={setOrderReportData}
                  setIsLoading={setIsLoading}
                />
              </CardBody>
            </Card>
          </Col>
          <Col lg="8">
            {orderReportData.length > 0 ? (
              <Card>
                <CardBody>
                  <Card className="card-transaction">
                    <CardHeader>
                      <CardTitle tag="h4">Items</CardTitle>
                      {/* <Icon.MoreVertical size={18} className="cursor-pointer" /> */}
                    </CardHeader>
                    <CardBody>
                      {orderReportData && orderReportData[0] && orderReportData[0].items.length > 0 ? renderItems() : (
                        <Alert color="info">
                          <div className="alert-body">
                            <span>No items found. Please ensure you select a valid date range</span>
                          </div>
                        </Alert>
                      )}
                      <hr className="my-3" />
                      {orderReportData && orderReportData[0] ? renderOptions() : ''}
                    </CardBody>
                  </Card>
                </CardBody>
              </Card>
            ) : (
              <Alert color="info">
                <div className="alert-body">
                  <span>Start by using the filter form to display a pick list</span>
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
