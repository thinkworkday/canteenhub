import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// import Chart from 'react-apexcharts';
// import { MoreVertical } from 'react-feather';
import {
  Card, CardHeader, CardTitle, CardBody, Media, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Badge,
} from 'reactstrap';
import {
  MoreVertical, Archive, ChevronDown,
} from 'react-feather';

import axios from 'axios';

import { headers } from '@configs/apiHeaders.js';
import DataTable from 'react-data-table-component';

import {
  getCutOffDate, getDeliveryDate, priceFormatter, formatDate,
} from '@utils';
import { DisplayStatus } from '@src/components/DisplayStatus';

// const getUpcomingEvents = async () => {
//   let data;
//   // fetch data from a url endpoint

//   return data;
// };

// ** Renders Role Columns
const renderProfile = (row) => {
  // console.log(row);
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

const columns = () => [
  {
    name: '#',
    selector: 'id',
    cell: (row) => <Link to={`/customer/order/edit/${row.orderNumber}`}>{`#${row.orderNumber}`}</Link>,
  },
  {
    name: 'Profile',
    minWidth: '250px',
    selector: (row) => renderProfile(row),
  },
  {
    name: 'Event Date',
    selector: (row) => getDeliveryDate(row.event.date, row.event.deliveryTime),
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
  {
    name: 'Status',
    selector: (row) => <DisplayStatus status={row.status} />,
    sortable: true,
  },
  {
    name: 'Order Placed',
    selector: (row) => formatDate(row.createdAt),
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
              to={`/customer/order/edit/${row.orderNumber}`}
              className="w-100"
            >
              <Archive size={14} className="mr-50" />
              <span className="align-middle">View</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>

      </>
    ),
  },
];

const CardOrders = () => {
  const [activeOrders, setActiveOrders] = useState({});

  const getActiveOrders = async () => {
    const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/orders/list`, { headers });
    const data = await response.data.results;
    setActiveOrders(data);
  };

  useEffect(() => {
    getActiveOrders();
  }, []);

  return (
    <Card className="card-employee-task">
      <CardHeader>
        <CardTitle tag="h4">Active Orders</CardTitle>
        {/* <Button.Ripple size="sm" color="flat-primary">show all &gt;</Button.Ripple> */}
        {/* <MoreVertical size={18} className="cursor-pointer" /> */}
      </CardHeader>
      <CardBody>

        <DataTable
          data={activeOrders}
          responsive
          className="react-dataTable"
          noHeader
          pagination
          // paginationPerPage={rowsPerPage}
          // paginationRowsPerPageOptions={paginationRowsPerPageOptions}
          columns={columns()}
          sortIcon={<ChevronDown />}
          // paginationDefaultPage={currentPage}
          // onChangePage={(page) => { handlePaginationChange(page); }}
          // onChangeRowsPerPage={(currentRowsPerPage, currentPage) => { handleRowPerPageChange(currentRowsPerPage, currentPage); }}
        />

      </CardBody>
    </Card>
  );
};

export default CardOrders;
