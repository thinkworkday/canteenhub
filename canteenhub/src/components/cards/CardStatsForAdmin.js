// ** React Imports
import { useEffect, useState } from 'react';

// ** API
import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';

import classnames from 'classnames';
import Avatar from '@components/avatar';
import {
  User, ArrowUp, Home, Users, Globe,
} from 'react-feather';
import {
  Badge, Card, CardHeader, CardTitle, CardBody, CardText, Row, Col, Media,
} from 'reactstrap';

const StatsCard = ({ cols }) => {
  const [orderReportData, setOrderReportData] = useState([]);
  let data;

  const statStyle = {
    customer: {
      color: 'light-primary',
      icon: <User size={24} />,
    },
    group: {
      color: 'light-secondary',
      icon: <Users size={24} />,
    },
    store: {
      color: 'light-info',
      icon: <Home size={24} />,
    },
    vendor: {
      color: 'light-success',
      icon: <Globe size={24} />,
    },
  };

  if (orderReportData[0]) {
    data = orderReportData[0].all.map((obj) => {
      const change30Days = orderReportData[0].in_past_30_days.find((e) => e._id === obj._id);
      return {
        title: obj.count,
        subtitle: `${obj._id}s`,
        change: change30Days ? change30Days.count : '0',
        color: statStyle[obj._id] ? statStyle[obj._id].color : 'light-info',
        icon: statStyle[obj._id] ? statStyle[obj._id].icon : <User size={24} />,
      };
    });
  }

  // fetch data on load
  useEffect(() => {
    async function fetchOrderReportData() {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/reports/adminStats`, { headers });
      setOrderReportData(response.data);
    }
    fetchOrderReportData();
  }, []);

  const renderData = () => data.map((item, index) => {
    const margin = Object.keys(cols);
    return (
      <Col
        key={index}
        {...cols}
        className={classnames({
          [`mb-2 mb-${margin[0]}-0`]: index !== data.length - 1,
        })}
      >
        <Media>
          <Avatar color={item.color} icon={item.icon} className="mr-2" />
          <Media className="my-auto" body>
            <h3 className="font-weight-bolder mb-0">{item.title}</h3>
            <CardText className="font-small-3 mb-0 mt-0 ">{item.subtitle}</CardText>
            <div className="d-flex align-items-center">
              <Badge color="light-success" className="badge-xs">
                <ArrowUp />
                <small>
                  {item.change}
                </small>
              </Badge>
            </div>
          </Media>
        </Media>
      </Col>
    );
  });

  return (
    <Card className="card-statistics">
      <CardHeader>
        <CardTitle tag="h4">User Statistics</CardTitle>
        <CardText className="card-text font-small-2 mr-25 mb-0">Change past 30days</CardText>
      </CardHeader>
      <CardBody className="statistics-body">
        <Row>{data ? renderData() : ''}</Row>
      </CardBody>
    </Card>
  );
};

export default StatsCard;
