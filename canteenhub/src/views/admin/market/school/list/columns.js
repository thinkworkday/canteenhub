// ** React Imports
import { Link } from 'react-router-dom';

// ** Store & Actions
import { store } from '@store/storeConfig/store';

// ** Third Party Components
import {
  Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';

import {
  MoreVertical, Archive,
} from 'react-feather';

import { getMarketSchool } from '@store/actions/market.actions';

// ** Renders Image Columns
const renderImage = (row) => {
  if (row.schoolLogo) {
    return <img src={row.schoolLogo} alt="logo" className="img-fluid market-school" />;
  }
  return (<></>);
};

export const columns = () => [
  {
    name: '',
    maxWidth: '100px',
    selector: (row) => renderImage(row),
  },
  {
    name: 'School Name',
    selector: (row) => `${row.schoolName}`,
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
              to={`/admin/market/school/edit/${row._id}`}
              className="w-100"
              onClick={() => store.dispatch(getMarketSchool(row._id))}
            >
              <Archive size={14} className="mr-50" />
              <span className="align-middle">Edit</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </>
    ),
  },
];
