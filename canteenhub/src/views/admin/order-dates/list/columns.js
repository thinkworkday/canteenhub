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
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';

import {
  MoreVertical, Calendar,
} from 'react-feather';
import { fetchEvent } from '@store/actions/event.actions';

import { getDeliveryDate, getCutOffDate } from '@utils';

export const columns = () => [
  {
    name: 'Event Date',
    // selector: (row) => getDeliveryDate(row.date, row.deliveryTime),
    sortable: true,
    minWidth: '250px',
    cell: (row) => <Link onClick={() => store.dispatch(fetchEvent(row._id))} to={`/admin/order-dates/view/${row._id}`}>{`${getDeliveryDate(row.date, row.deliveryTime)}`}</Link>,
  },
  {
    name: 'Cutoff',
    selector: (row) => getCutOffDate(getDeliveryDate(row.date, row.deliveryTime), row.cutoffPeriod, true),
    sortable: true,
  },
  {
    name: 'Event Title',
    selector: (row) => `${row.title}`,
    sortable: true,
  },
  {
    name: 'Vendor',
    selector: (row) => (
      <div>
        {row.vendor?.companyName}
      </div>
    ),
    sortable: true,
  },
  {
    name: 'Group',
    selector: (row) => (
      <div>
        {row.group?.companyName}
      </div>
    ),
    sortable: true,
  },
  {
    name: 'Store',
    selector: (row) => (
      <div>
        {row.store?.storeName}
      </div>
    ),
    sortable: true,
  },
  {
    name: 'Status',
    selector: (row) => <DisplayStatus status={row.status} />,
    sortable: true,
  },
  {
    name: 'Actions',
    width: '120px',
    cell: (row) => (
      <>
        <UncontrolledDropdown>
          <DropdownToggle tag="div" className="btn btn-sm">
            <MoreVertical size={14} className="cursor-pointer action-btn" />
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem
              tag={Link}
              to={`/admin/order-dates/view/${row._id}`}
              className="w-100"
              onClick={() => store.dispatch(fetchEvent(row._id))}
            >
              <Calendar size={14} className="mr-50" />
              <span className="align-middle">View details</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>

      </>
    ),
  },
];
