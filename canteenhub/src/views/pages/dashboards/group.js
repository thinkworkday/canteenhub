// ** React Imports
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
  Row, Col,
} from 'reactstrap';

// **  Custom Components
import AlertInvites from '@src/components/AlertInvites';
import CardDashboardProfile from '@src/components/cards/CardDashboardProfile';
import CardGroupSuppliers from '@src/components/cards/CardGroupSuppliers';
import ChartOrdersBar from '@src/components/charts/ordersBar';
import ApproveEventsCTA from '@src/components/ctas/ApproveEvents';
import CardUpcomingOrderDates from '@src/components/cards/CardUpcomingOrderDates';

// import OrderTable from '@src/components/tables/OrderTable';

// ** Function Imports
import { getLoggedUser } from '@utils';

import { getMe } from '@store/actions/user.actions';

const Home = () => {
  const dispatch = useDispatch();

  // Get the Usergroup
  const loggedUser = getLoggedUser();

  // ** Get data on mount
  useEffect(() => {
    dispatch(getMe());
  }, []);

  return (
    <div>
      {/*
      <Row className="justify-content-between mb-2">
        <Col>
          <h3>Dashboard</h3>
        </Col>
      </Row> */}

      <AlertInvites />
      <ApproveEventsCTA />

      <Row>
        <Col md="6" lg="4" sm="12">
          <CardDashboardProfile />
        </Col>
        <Col md="6" lg="4" sm="12">
          <CardGroupSuppliers groupId={loggedUser._id} />
        </Col>
        <Col md="6" lg="4" sm="12">
          <CardUpcomingOrderDates />
        </Col>
      </Row>

      <Row>
        <Col md="6" lg="8" sm="12">
          <ChartOrdersBar />
        </Col>
      </Row>

    </div>
  );
};

export default Home;
