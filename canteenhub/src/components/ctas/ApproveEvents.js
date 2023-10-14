import { useEffect, useState } from 'react';
import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';
// import { Link } from 'react-router-dom';

import {
  Card, CardBody, CardText,
} from 'reactstrap';
// import medal from '@src/assets/images/illustration/badge.svg';
import iconEvent from '@src/assets/images/icons/event.svg';

const ApproveEventsCTA = () => {
  const [pendingCount, setPendingCount] = useState(0);

  // ** Get data on mount
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/api/events/list/`,
      {
        headers,
        params: { status: 'pending', role: 'vendor', upcoming: true },
      }).then((response) => {
      setPendingCount(response.data.filteredCount);
    }).catch((e) => {
      // eslint-disable-next-line no-console
      console.log(e);
    });
  }, []);

  // const getReviewCount = () => (
  //   <div />
  // );

  return (
    <>
      {pendingCount > 0 ? (
        <Card className="card-approve-cta">
          <CardBody className="d-flex justify-content-lg-between align-items-center flex-wrap">
            <div className="d-flex align-items-center">
              <div className="card-icon" style={{ height: 'fit-content' }}>
                <img className="" src={iconEvent} alt="Event" />
              </div>
              <div>
                <h6 className="mb-0">
                  {pendingCount}
                  {' '}
                  New order date(s) are awaiting your approval
                </h6>
                <CardText><small>Go to list to review pending accounts</small></CardText>
              </div>
            </div>
            <a href="/group/order-dates-pending" className="waves-effect ml-auto btn btn-primary ">View</a>
          </CardBody>
        </Card>
      ) : ''}

    </>
  );
};

export default ApproveEventsCTA;
