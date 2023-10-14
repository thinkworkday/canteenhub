// ** React Imports
import { Link } from 'react-router-dom';
// import moment from 'moment';

// ** Custom Components

import { DisplayStatus } from '@src/components/DisplayStatus';

// ** Third Party Components
import {
  Media,
} from 'reactstrap';

// import { updateStore } from '@store/actions/vendor.actions';

import {
  getDeliveryDate, priceFormatter,
  getLoggedUser,
} from '@utils';

// ** Renders Role Columns
const renderProfile = (row) => {
  const profile = row.profile[0];
  return (
    <Media>
      <Media className="my-auto" body>
        <div>{`${profile.firstName} ${profile.lastName}`}</div>
        <small>
          {profile.group ? `${profile.group.companyName} (${profile.subgroups[0].name})` : (
            <span className="text-info">No school. Please assign.</span>
          ) }
        </small>
      </Media>
    </Media>
  );
};

const renderEvent = (row) => {
  const event = row.event[0];
  return (
    <Media>
      <Media className="my-auto" body>
        <div>{`${event.title}`}</div>
        <small>
          {getDeliveryDate(event.date, event.deliveryTime)}
        </small>
      </Media>
    </Media>
  );
};

export const columns = () => {
  const loggedUser = getLoggedUser();
  const { role } = loggedUser;

  return ([
    {
      name: '#',
      selector: 'id',
      maxWidth: '100px',
      cell: (row) => <Link to={`/${role}/order/edit/${row.orderNumber}`}>{`#${row.orderNumber}`}</Link>,
    },
    {
      name: 'Profile',
      minWidth: '250px',
      selector: (row) => renderProfile(row),
    },
    {
      name: 'Amount',
      selector: (row) => (`${priceFormatter(row.orderTotals[0].orderLinesSubtotal)}`),
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => <DisplayStatus status={row.status} />,
      sortable: true,
    },
    {
      name: 'Event',
      selector: (row) => renderEvent(row),
      sortable: true,
    },
  ]);
};
