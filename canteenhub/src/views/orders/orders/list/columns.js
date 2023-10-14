// ** React Imports
import { Link } from 'react-router-dom';

// ** Custom Components
import { DisplayStatus } from '@src/components/DisplayStatus';

// ** Store & Actions

// ** Third Party Components
import {
  Media, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Badge,
} from 'reactstrap';

import {
  MoreVertical, Archive,
} from 'react-feather';

import {
  formatDate, getDeliveryDate, getCutOffDate, priceFormatter,
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
          )}
        </small>
      </Media>
    </Media>
  );
};

const renderCurrencyAmount = (currency, orderLinesSubtotal) => {
  const currencyObj = {
    AUD: {
      class: 'light-primary',
    },
    NZD: {
      class: 'light-info',
    },
  };

  return (
    <span className="text-truncate text-capitalize align-middle">
      <Badge color={`${currencyObj[currency] ? currencyObj[currency].class : ''}`}>
        {currency}
      </Badge>
      <span>{priceFormatter(orderLinesSubtotal)}</span>
    </span>
  );
};

export const columns = () => {
  const loggedUser = getLoggedUser();
  const { role } = loggedUser;

  return ([
    {
      name: '#',
      selector: 'id',
      cell: (row) => <Link to={`/${role}/order/edit/${row.orderNumber}`}>{`#${row.orderNumber}`}</Link>,
    },
    {
      name: 'Profile',
      minWidth: '250px',
      selector: (row) => renderProfile(row),
    },
    {
      name: 'Group',
      sortable: true,
      minWidth: '250px',
      selector: (row) => `${row.profile[0].group.companyName} (${row.profile[0].subgroups[0].name})`,
    },
    {
      name: 'Store',
      sortable: true,
      minWidth: '250px',
      selector: (row) => (row.store.length > 0 ? `${row.store[0].storeName}` : ''),
    },
    {
      name: 'Event Date',
      minWidth: '250px',
      selector: (row) => `${formatDate(row.event.deliveryDateTimeUTC)}`,
      sortable: true,
    },
    {
      name: 'Order Cutoff',
      selector: (row) => getCutOffDate(getDeliveryDate(row.event.date, row.event.deliveryTime), row.event.cutoffPeriod, true),
      sortable: true,
    },
    {
      name: 'Amount',
      selector: (row) => renderCurrencyAmount(row.orderTotals[0].orderCurrency ? `${row.orderTotals[0].orderCurrency}` : 'AUD', row.orderTotals[0].orderLinesSubtotal),
      sortable: true,
    },
    // {
    //   name: 'Transaction ID',
    //   selector: (row) => `${row.transactionData[0].id}`,
    //   sortable: true,
    // },

    {
      name: 'Status',
      selector: (row) => <DisplayStatus status={row.status} />,
      sortable: true,
    },
    {
      name: 'Order Placed',
      selector: (row) => (formatDate(row.createdAt)),
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
                to={`/${role}/order/edit/${row.orderNumber}`}
                className="w-100"
              >
                <Archive size={14} className="mr-50" />
                <span className="align-middle">Edit</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>

        </>
      ),
    },
  ]);
};
