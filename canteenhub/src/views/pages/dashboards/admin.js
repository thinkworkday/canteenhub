import {
  Row, Col,
} from 'reactstrap';
import { useState } from 'react';
import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';
import {
  CheckCircle,
} from 'react-feather';
import { toast } from 'react-toastify';

// **  Custom Components
import CardApproveUsersCTA from '@src/components/ctas/CardApproveUsersCTA';
import CardNewYearStart from '@src/components/ctas/CardNewYearStart';
import CardEarnings from '@src/components/cards/CardEarnings';
import CardStatsForAdmin from '@src/components/cards/CardStatsForAdmin';
import ChartOrdersBar from '@src/components/charts/ordersBar';
import ModalNewYearUpdate from './ModalNewYearUpdate';

const Home = () => {
  const [newYearCheckModalVisibility, setNewYearCheckModalVisibility] = useState(false);
  const newYearStartHandle = (status) => {
    setNewYearCheckModalVisibility(status);
  };
  const toggleNewYearUpdateModal = () => { setNewYearCheckModalVisibility(!newYearCheckModalVisibility); };
  const handleSubgroupsUpdate = async () => {
    await axios(`${process.env.REACT_APP_SERVER_URL}/api/subgroups/reset`, {
      method: 'PUT',
      data: {},
      headers,
    }).then(async (response) => {
      if (response) {
        toast.success(
          <>
            <CheckCircle className="mr-1 text-success" />
            New Year School successfully Started!
          </>, {
            hideProgressBar: true,
          }
        );
      }
    });
  };
  const newYearSchoolUpdate = () => {
    handleSubgroupsUpdate();
  };
  return (
    <div>
      <Row className="justify-content-between mb-1 mt-1">
        <Col>
          <h3>Dashboard</h3>
        </Col>
      </Row>
      <CardNewYearStart newYearStartHandle={newYearStartHandle} />
      <CardApproveUsersCTA />

      <Row className="match-height">
        <Col xl="4" md="6" xs="12">
          <CardEarnings />
        </Col>
        <Col xl="8" md="6" xs="12">
          <CardStatsForAdmin cols={{ xl: '3', sm: '6' }} />
        </Col>
      </Row>

      <Row>
        <Col sm="12">
          <ChartOrdersBar type="revenue" />
          <ChartOrdersBar />
        </Col>
      </Row>
      <ModalNewYearUpdate newYearCheckModalVisibility={newYearCheckModalVisibility} modalToggle={() => toggleNewYearUpdateModal()} newYearSchoolUpdate={() => newYearSchoolUpdate()} />
    </div>
  );
};

export default Home;
