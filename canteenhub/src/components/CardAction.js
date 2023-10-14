import {
  Badge, Card, CardBody, CardHeader, CardText, CardTitle, Button,
} from 'reactstrap';
import { Link } from 'react-router-dom';

import {
  ChevronRight,
} from 'react-feather';

// import medal from '@src/assets/images/illustration/badge.svg';

const CardTodo = (props) => {
  const { dataCount } = props;

  return (
    <Card className="card-action">
      <CardBody>
        {props.imageComponent}
        <div className="d-flex align-items-center mt-2">
          <h5 className="mr-2">{props.title}</h5>
          <Badge color={dataCount && dataCount > 0 ? 'light-success' : 'light-secondary'} pill>
            {dataCount && dataCount > 0 ? 'completed' : 'not completed'}
          </Badge>
        </div>
        <CardText className="font-small-3"><small>{props.content}</small></CardText>
        <Button.Ripple tag={Link} to={props.btnTo} color="primary" size="sm" className="mt-1">
          {props.btnText}
          {' '}
          <ChevronRight />
        </Button.Ripple>
        {/* <img className="congratulation-medal" src={medal} alt="Medal Pic" /> */}
      </CardBody>
    </Card>
  );
};

export default CardTodo;
