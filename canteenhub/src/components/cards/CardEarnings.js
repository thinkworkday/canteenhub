// ** React Imports
import { useEffect } from 'react';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';
import { getTransactions } from '@store/actions/payment.actions';

import { Doughnut } from 'react-chartjs-2';

import {
  priceFormatter,
} from '@utils';

import {
  Card, CardTitle, CardText, CardBody, Row, Col,
} from 'reactstrap';

const Earnings = () => {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions);

  let fullFilledCommission = 0;
  let totalPayout = 0;

  if (transactions.data && transactions.data.length > 0) {
    fullFilledCommission = transactions.data.map((obj) => {
      const fulFilledOrders = obj.fulFilledOrders ? obj.fulFilledOrders : obj.fullFilledOrders;
      return fulFilledOrders.reduce((previousValue, currentValue) => previousValue + currentValue.commissionAmount, 0);
    }).reduce((partialSum, a) => partialSum + a, 0);

    totalPayout = transactions.data.map((obj) => {
      const fulFilledOrders = obj.fulFilledOrders ? obj.fulFilledOrders : obj.fullFilledOrders;
      return fulFilledOrders.reduce((previousValue, currentValue) => previousValue + currentValue.payoutAmount, 0);
    }).reduce((partialSum, a) => partialSum + a, 0);
  }

  // fetch data on load
  useEffect(() => {
    dispatch(getTransactions({
      type: 'payout',
      dateRange: [new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()],
    }));
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    responsiveAnimationDuration: 500,
    cutoutPercentage: 60,
    legend: { display: false },
    tooltips: {
      callbacks: {
        label(tooltipItem, data) {
          const label = data.datasets[0].labels[tooltipItem.index] || '';
          const value = data.datasets[0].value[tooltipItem.index];
          const output = ` ${label} : ${value}`;
          return output;
        },
      },
    },
  };
  const data = {
    datasets: [
      {
        labels: ['Commission', 'Payouts'],
        data: [10, 80],
        value: [priceFormatter(fullFilledCommission || 0), priceFormatter(totalPayout || 0)],
        backgroundColor: ['#804099', '#B7FFE4'],
        borderWidth: 0,
        pointStyle: 'rectRounded',
      },
    ],
  };

  return (
    <Card className="earnings-card">
      <CardBody>
        <Row>
          <Col xs="6">
            <CardTitle className="mb-1">Earnings</CardTitle>
            <div className="font-small-2">Past 30 Days</div>
            <h5 className="mb-1">{priceFormatter(fullFilledCommission || 0)}</h5>
            <CardText className="text-muted font-small-2">
              <span className="font-weight-bolder">{priceFormatter(totalPayout || 0)}</span>
              <span> total payouts in past 30 days</span>
            </CardText>
          </Col>
          <Col xs="6">
            <div style={{ height: '180px' }}>
              <Doughnut data={data} options={options} height={180} />
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default Earnings;
