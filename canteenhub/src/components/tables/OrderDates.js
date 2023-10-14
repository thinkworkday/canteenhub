import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// import Chart from 'react-apexcharts';
import Avatar from '@components/avatar';
// import { MoreVertical } from 'react-feather';
import {
  Card, CardHeader, CardTitle, CardBody, Media, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Col, Input,
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

const columns = () => [
  {
    name: 'Event Date',
    sortable: true,
    minWidth: '250px',
    cell: (row) => <Link to={`/group/order-dates/view/${row._id}`}>{`${getDeliveryDate(row.date, row.deliveryTime)}`}</Link>,
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
              to={`/group/order-dates/view/${row._id}`}
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

const CardOrderDates = () => {
  const [activeOrders, setActiveOrders] = useState({});

  const getActiveOrders = async () => {
    const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/orders/list`, { headers });
    const data = await response.data.results;
    setActiveOrders(data);
  };

  const [upcomingEvents, setUpcomingEvents] = useState({});

  const getUpcomingEvents = async () => {
    const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/events/list?upcoming=true&sort=asc`, { headers });
    const data = await response.data.results;
    setUpcomingEvents(data);
  };

  useEffect(() => {
    getUpcomingEvents();
  }, []);

  return (
    <Card className="card-employee-task">
      <CardHeader>
        <CardTitle tag="h4">Upcoming Events</CardTitle>
        {/* <Button.Ripple size="sm" color="flat-primary">show all &gt;</Button.Ripple> */}
        {/* <MoreVertical size={18} className="cursor-pointer" /> */}
      </CardHeader>
      <CardBody>

        <DataTable
          data={upcomingEvents}
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

export default CardOrderDates;
