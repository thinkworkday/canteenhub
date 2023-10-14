// ** React Imports
import { Link } from 'react-router-dom';
// ** Custom Components
// import moment from 'moment';
// import { DateItem } from '@src/components/DateItem';
import { DisplayStatus } from '@src/components/DisplayStatus';

// ** Store & Actions
import { store } from '@store/storeConfig/store';

// ** Third Party Components
import {
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Media,
} from 'reactstrap';

import {
  MoreVertical, Calendar,
} from 'react-feather';
import { fetchEvent } from '@store/actions/event.actions';

import { formatDate, getDeliveryDate, priceFormatterNoCurrency } from '@utils';

// ** Renders Role Columns
const renderEvent = (row) => {
  const event = row.event[0];
  return (
    <Media>
      <Media className="my-auto" body>
        <div>
          {event.group ? `${event.group.companyName}` : (
            <span className="text-info">No school. Please assign.</span>
          ) }
        </div>
        <small>{`${getDeliveryDate(event.date, event.deliveryTime)}`}</small>
      </Media>
    </Media>
  );
};

export const columns = () => [
  {
    name: 'Date',
    selector: (row) => `${formatDate(row.createdAt)}`,
    sortable: true,
  },
  {
    name: '# Orders Fulfilled',
    selector: (row) => `${row.fulFilledOrders.length}`,
    sortable: true,
  },
  {
    name: 'Event',
    selector: (row) => renderEvent(row),
    sortable: true,
  },
  {
    name: 'Payout Amount',
    selector: (row) => `$${priceFormatterNoCurrency(row.payoutAmount / 100)}`,
    sortable: true,
  },
  {
    name: 'Status',
    selector: (row) => <DisplayStatus status={row.status} />,
    sortable: true,
  },
  // {
  //   name: 'Actions',
  //   width: '120px',
  //   cell: (row) => (
  //     <>
  //       <UncontrolledDropdown>
  //         <DropdownToggle tag="div" className="btn btn-sm">
  //           <MoreVertical size={14} className="cursor-pointer action-btn" />
  //         </DropdownToggle>
  //         <DropdownMenu right>
  //           <DropdownItem
  //             tag={Link}
  //             to={`/admin/order-dates/view/${row._id}`}
  //             className="w-100"
  //             onClick={() => store.dispatch(fetchEvent(row._id))}
  //           >
  //             <Calendar size={14} className="mr-50" />
  //             <span className="align-middle">View details</span>
  //           </DropdownItem>
  //         </DropdownMenu>
  //       </UncontrolledDropdown>

  //     </>
  //   ),
  // },
];
