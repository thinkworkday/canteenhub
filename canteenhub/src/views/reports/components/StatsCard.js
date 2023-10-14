import classnames from 'classnames';
import Avatar from '@components/avatar';
import {
  Card, CardHeader, CardTitle, CardBody, CardText, Row, Col, Media,
} from 'reactstrap';

const StatsCard = ({ cols, data }) => {
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
            <h4 className="font-weight-bolder mb-0">{item.title}</h4>
            <CardText className="font-small-3 mb-0">{item.subtitle}</CardText>
          </Media>
        </Media>
      </Col>
    );
  });

  return (
    <Card className="card-statistics">
      <CardHeader>
        <CardTitle tag="h4">Total Sales</CardTitle>
        <CardText className="card-text font-small-2 mr-25 mb-0">$AUD</CardText>
      </CardHeader>
      <CardBody className="statistics-body">
        <Row>{data ? renderData() : ''}</Row>
      </CardBody>
    </Card>
  );
};

export default StatsCard;
