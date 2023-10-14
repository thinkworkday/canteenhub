
import {
  Badge,
} from 'reactstrap';

export const DisplayStatus = (props) => {
  let color;
  switch (props.status) {
    case 'active':
      color = 'light-success';
      break;

    case 'approved':
      color = 'light-success';
      break;

    case 'completed':
      color = 'light-success';
      break;

    case 'pending':
      color = 'light-warning';
      break;

    case 'fulfilled':
      color = 'light-info';
      break;

    case 'deleted':
      color = 'light-secondary';
      break;

    default:
      color = 'light-primary';
      break;
  }

  return (
    <Badge color={color} pill>
      {props.status}
    </Badge>
  );
};
