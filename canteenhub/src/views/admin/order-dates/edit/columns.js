// ** React Imports
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import moment from 'moment';

// ** Custom Components

import { DisplayStatus } from '@src/components/DisplayStatus';

// ** Store & Actions
import { store } from '@store/storeConfig/store';
import { useDispatch } from 'react-redux';
import { updateMenu } from '@store/actions/menu.actions';

// ** Third Party Components
import Avatar from '@components/avatar';
import {
  Media, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Col, Input,
} from 'reactstrap';

import {
  MoreVertical, CheckCircle, Trash2, Archive,
} from 'react-feather';
import { toast } from 'react-toastify';
// import { updateStore } from '@store/actions/vendor.actions';

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
          ) }
        </small>
      </Media>
    </Media>
  );
};

const handleEditClick = (orderId) => {
  alert('handle edit click');
};

export const columns = (toggleDeleteRecordModal) => {
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
      name: 'Order Date',
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
      selector: (row) => `${priceFormatter(row.orderTotals[0].orderSubtotal)}`,
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
      selector: (row) => formatDate(row.event.createdAt),
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
                // tag={Link}
                // to={`/${role}/order/edit/${row.orderNumber}`}
                className="w-100"
                onClick={() => handleEditClick(row.orderNumber)}
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
