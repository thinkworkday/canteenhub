// ** React Imports
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';
import {
  Row, Col,
} from 'reactstrap';

// **  Custom Components
import CardDashboardProfile from '@src/components/cards/CardDashboardProfile';
import CardCustomerProfiles from '@src/components/cards/CardCustomerProfiles';
import CardUpcomingOrderDates from '@src/components/cards/CardUpcomingOrderDates';
import OrderTable from '@src/components/tables/OrderTable';

// ** Function Imports
import { getLoggedUser } from '@utils';

import { getMe } from '@store/actions/user.actions';
import ModalCustomerUpdate from './ModalCustomerUpdate';

const Home = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  // Get the Usergroup
  const loggedUser = getLoggedUser();
  const [modalUpdateVisibility, setModalUpdateVisibility] = useState(loggedUser.checkOldYear);
  const handleNewYearLoginUpdate = async () => {
    await axios(`${process.env.REACT_APP_SERVER_URL}/api/users/user/checkNewYearLogin`, {
      method: 'PUT',
      data: {},
      headers,
    }).then(async (response) => { dispatch(getMe()); });
  };
  const toggleUpdateModal = () => {
    handleNewYearLoginUpdate();
    setModalUpdateVisibility(!modalUpdateVisibility);
  };
  const newYearSchoolCheckAccept = () => {
    history.push('/customer/profiles');
  };

  // ** Get data on mount
  useEffect(() => {
    dispatch(getMe());
  }, []);

  return (
    <>
      <div>
        {/* <Card>
        <CardHeader>
          <CardTitle>Customer Dashboard</CardTitle>
        </CardHeader>
      </Card> */}
        {/*
      <Row className="mt-3">
        &nbsp;
      </Row> */}

        <Row>
          <Col md="6" lg="4" sm="12">
            <CardDashboardProfile />
          </Col>
          <Col md="6" lg="4" sm="12">
            <CardCustomerProfiles data={loggedUser.profiles ? loggedUser.profiles : {}} />
          </Col>
          <Col md="6" lg="4" sm="12">
            <CardUpcomingOrderDates data={loggedUser.profiles ? loggedUser.profiles : {}} />
          </Col>
        </Row>

        <Row>
          <Col>
            <OrderTable />
          </Col>
        </Row>
      </div>
      <ModalCustomerUpdate modalVisibility={modalUpdateVisibility} modalToggle={() => toggleUpdateModal()} newYearSchoolCheckAccept={() => newYearSchoolCheckAccept()} />
    </>
  );
};

export default Home;
