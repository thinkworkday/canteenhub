
import { useEffect, useState } from 'react';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';

// components
import {
  Row, Col, Card, CardBody,
} from 'reactstrap';

import { getLoggedUser } from '@utils';
// import AlertVerifyEmail from '../../../components/AlertVerifyEmail';
import { getStores } from '@store/actions/vendor.actions';
import { getGroups } from '@store/actions/group.actions';

// ** components
import StoreSVG from '@src/assets/images/illustrations/storeHero';
import SchoolSVG from '@src/assets/images/illustrations/schoolHero';
import ChartOrdersBar from '@src/components/charts/ordersBar';
import { DisplayStatus } from '@src/components/DisplayStatus';
import CardAction from '@src/components/CardAction';
import CardStoreList from '@src/components/CardStoreList';
import CardUpcomingOrderDates from '@src/components/cards/CardUpcomingOrderDates';
import CTAVendorPendingOrders from '@src/components/ctas/VendorPendingOrders';
import VendorPendingOrderNotes from '@src/components/ctas/VendorPendingOrderNotes';

const Home = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  const stores = useSelector((state) => state.stores);
  const groups = useSelector((state) => state.groups);

  // ** States
  const [loading, setLoading] = useState(true);

  const loggedUser = getLoggedUser();

  useEffect(() => {
    dispatch(getStores());
    dispatch(getGroups());
  }, [dispatch]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);

  return (
    <div>
      {/* <AlertVerifyEmail email={loggedUser.email} emailVerified={loggedUser.emailVerified} /> */}
      <Row className="justify-content-between mb-2">
        <Col>
          <h3>Dashboard</h3>
        </Col>
        <Col className="text-right">
          {loggedUser.role === 'vendor' ? (
            <>
              <small>Status:</small>
              {' '}
              <DisplayStatus status={loggedUser.status} />
            </>
          ) : <></> }
        </Col>
      </Row>

      {loading ? '' : (
        <>
          { (loggedUser.role === 'store') || (stores && groups && stores.data.length > 0 && groups.data.length > 0) ? <></> : (
            <Card className="w-100">
              <CardBody>
                <Row>
                  <Col md="6" lg="4" sm="12">
                    <Card className="mb-0 pb-0">
                      <CardBody className="pb-0">
                        <h3>Getting Started</h3>
                        {/* <small className="w-75">Thanks for registering as a partner with Canteen Hub. Before you can start transacting with the platform, you will first need to setup and configure your account.</small> */}
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                <Row className="match-height">
                  <Col md="6" sm="12">
                    <CardAction imageComponent={<StoreSVG />} dataCount={stores.data.length} title="1. Setup your store(s)" content="You will need to setup at least one store in order to transact on Canteen Hub. Stores are the physical premises that prepare and dispatch orders." btnText="Create a Store" btnTo="/vendor/stores" />
                  </Col>
                  <Col md="6" sm="12">
                    <CardAction imageComponent={<SchoolSVG />} dataCount={groups.data.length} title="2. Connect with Schools" content="Schools are your customers. End users (e.g. Parents) will order through these schools. Your orders will be delivered to groups at a certain time, defined by you. " btnText="Connect with Schools" btnTo="/vendor/schools" />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          ) }
          <Row>
            <Col md="6" lg="8" sm="12">
              <CTAVendorPendingOrders />
              <VendorPendingOrderNotes />
              <ChartOrdersBar type="revenue" />
            </Col>
            <Col md="6" lg="4" sm="12">
              <CardStoreList storeData={stores} />
              <CardUpcomingOrderDates />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default Home;
