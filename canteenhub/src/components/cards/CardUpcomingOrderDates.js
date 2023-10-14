import { useEffect, useState } from 'react';
import {
  Alert, Card, CardHeader, CardTitle, CardBody, Media,
} from 'reactstrap';
import CardFooter from 'reactstrap/lib/CardFooter';

import axios from 'axios';

import { headers } from '@configs/apiHeaders.js';
import { DateItem } from '@src/components/DateItem';
import { getDeliveryDate, getCutOffDate, getLoggedUser } from '@utils';

const CardUpcomingOrderDates = () => {
  const [upcomingEvents, setUpcomingEvents] = useState({});

  const loggedUser = getLoggedUser();

  const getUpcomingEvents = async () => {
    const response = loggedUser.role === 'customer' ? await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/events/upcoming/all`, { headers }) : await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/events/list?upcoming=true&sort=date&sortBy=1`, { headers });
    const data = await response.data.results;
    setUpcomingEvents(data);
  };

  useEffect(() => {
    getUpcomingEvents();
  }, []);

  const renderUpcomingEvents = () => upcomingEvents.map((event, i) => {
    if (i <= 2) {
      return (
        <div key={event._id} className="card-row d-flex justify-content-between align-items-center ">
          <Media>
            <DateItem date={event.date} size="sm" />
            <Media className="my-auto" body>
              <h6 className="mb-0">{`${event.store.storeName} `}</h6>
              <small className="d-block">
                School:
                {' '}
                {event.group.companyName}
              </small>
              <small className="d-block">
                Delivery:
                {' '}
                {event.deliveryTime}
              </small>
              <small className="d-block">
                Order Cutoff:
                {' '}
                {getCutOffDate(getDeliveryDate(event.date, event.deliveryTime), event.cutoffPeriod, true)}
              </small>
            </Media>
          </Media>
        </div>
      );
    }

    return '';
  });

  const moreCount = upcomingEvents.length > 3 ? upcomingEvents.length - 3 : 0;

  return (
    <Card className="card-employee-task">
      <CardHeader>
        <CardTitle tag="h4">Upcoming Events</CardTitle>
      </CardHeader>
      <CardBody>
        {upcomingEvents.length > 0 ? renderUpcomingEvents() : (
          <Alert color="info">
            <div className="alert-body">
              <span>Your profiles do not have any upcoming events</span>
            </div>
          </Alert>
        )}
      </CardBody>
      <CardFooter className="border-0 pt-0 ">
        {moreCount > 0 ? <small>{`${moreCount} more...`}</small> : ''}
      </CardFooter>
    </Card>
  );
};

export default CardUpcomingOrderDates;
