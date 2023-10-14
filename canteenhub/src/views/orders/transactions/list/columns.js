// ** React Imports
import { Link } from 'react-router-dom';

// ** Custom Components
import { DisplayStatus } from '@src/components/DisplayStatus';

// ** Store & Actions

// ** Third Party Components
import {
  Media, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';

import {
  MoreVertical, Archive,
} from 'react-feather';

import {
  formatDate, getDeliveryDate, getCutOffDate, priceFormatter,
  getLoggedUser,
} from '@utils';

// ** Renders Role Columns
// const renderProfile = (row) => {
//   const profile = row.profile[0];
//   return (
//     <Media>
//       <Media className="my-auto" body>
//         <div>{`${profile.firstName} ${profile.lastName}`}</div>
//         <small>
//           {profile.group ? `${profile.group.companyName} (${profile.subgroups[0].name})` : (
//             <span className="text-info">No school. Please assign.</span>
//           ) }
//         </small>
//       </Media>
//     </Media>
//   );
// };

export const columns = () => {
  const loggedUser = getLoggedUser();
  const editUrl = `/${loggedUser.role}/transaction/view/`;

  const colData = [
    {
      name: 'Transaction ID',
      selector: 'id',
      cell: (row) => <Link to={`${editUrl}${row._id}`}>{`${row._id}`}</Link>,
    },
    {
      name: 'Date',
      selector: (row) => (formatDate(row.createdAt)),
      sortable: true,
    },
  ];

  if (loggedUser.role === 'admin') {
    colData.push({
      name: 'customer',
      selector: (row) => (`${row.customer ? row.customer.firstName : ''} ${row.customer ? row.customer.lastName : ''}`),
      sortable: true,
    });
  }

  colData.push({
    name: '# Orders',
    selector: (row) => `${row.orderCount}`,
    sortable: true,
  },
  {
    name: 'Transaction Fees',
    selector: (row) => priceFormatter(row.transactionData ? row.transactionData.transaction_fees : 0),
    sortable: true,
  },
  {
    name: 'Late Order Fees',
    selector: (row) => priceFormatter(row.transactionData && row.transactionData.late_fees ? row.transactionData.late_fees : 0),
    sortable: true,
  },
  {
    name: 'Transaction Total',
    selector: (row) => priceFormatter(row.transactionData ? row.transactionData.transaction_total : 0),
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
              to={`${editUrl}${row._id}`}
              className="w-100"
            >
              <span className="align-middle">View Details</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>

      </>
    ),
  });

  return (colData);
};
