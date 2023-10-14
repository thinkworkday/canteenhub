/* eslint-disable import/no-mutable-exports */
import { useState } from 'react';

// ** Third Party Components
import {
  Media, Badge,
} from 'reactstrap';

import {
  priceFormatter, getVendorCommission,
} from '@utils';

import { DisplayStatus } from '@src/components/DisplayStatus';

// ** Vars
export let data;

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

// ** Render Payout
// const renderPayout = (row) => {
//   const { orderLinesSubtotal } = row.orderTotals[0];
//   // const payoutAmount = orderLinesSubtotal;

//   const [payoutAmount, setCommission] = useState();
//   getVendorCommission(row).then((result) => (setCommission(result)));

//   return (
//     <Media>
//       <Media className="my-auto" body>
//         {/* {priceFormatter(payoutAmount)} */}

//         {payoutAmount}
//       </Media>
//     </Media>
//   );
// };

// ** Renders Printed
const renderPrinted = (row) => (row.labelPrinted ? (
  <Badge color="success" pill>
    Yes
  </Badge>
) : (
  <Badge color="light-primary" pill>
    No
  </Badge>
));

// ** Table Common Column
export const columns = [
  {
    name: '#',
    selector: 'orderNumber',
    sortable: true,
    minWidth: '80px',
  },
  {
    name: 'Profile',
    minWidth: '250px',
    selector: (row) => renderProfile(row),
  },
  {
    name: 'Status',
    selector: (row) => <DisplayStatus status={row.status} />,
    sortable: true,
  },
  {
    name: 'Printed?',
    selector: (row) => renderPrinted(row),
    sortable: true,
  },
  {
    name: 'Amount',
    selector: (row) => `${priceFormatter(row.orderTotals[0].orderLinesSubtotal)}`,
    sortable: true,
  },
];
