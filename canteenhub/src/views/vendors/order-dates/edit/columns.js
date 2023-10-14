// ** React Imports
// import { useState } from 'react';
import { Link } from 'react-router-dom';
// import moment from 'moment';

// ** Custom Components

import { DisplayStatus } from '@src/components/DisplayStatus';

// ** Third Party Components
// import Avatar from '@components/avatar';
import {
  Media,
} from 'reactstrap';

import {
  formatDate, priceFormatter, getLoggedUser,
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

// const handleEditClick = () => {
//   alert('handle edit click');
// };

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
      selector: (row) => `${priceFormatter(row.orderTotals[0].orderLinesSubtotal)}`,
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
    //             // tag={Link}
    //             // to={`/${role}/order/edit/${row.orderNumber}`}
    //             className="w-100"
    //             onClick={() => handleEditClick(row.orderNumber)}
    //           >
    //             <Archive size={14} className="mr-50" />
    //             <span className="align-middle">Edit</span>
    //           </DropdownItem>
    //         </DropdownMenu>
    //       </UncontrolledDropdown>

    //     </>
    //   ),
    // },
  ]);
};
