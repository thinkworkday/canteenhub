// ** React Imports
import { Link } from 'react-router-dom';

// ** Store & Actions
import { store } from '@store/storeConfig/store';

// ** Third Party Components
import {
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';

import {
  MoreVertical, Archive,
} from 'react-feather';

import { getMarketPartner } from '@store/actions/market.actions';

// ** Renders Image Columns
const renderImage = (row) => {
  if (row.partnerLogo) {
    return <img src={row.partnerLogo} alt="logo" className="img-fluid market-school" />;
  }
  return (<></>);
};

export const columns = () => [
  {
    name: '',
    maxWidth: '150px',
    selector: (row) => renderImage(row),
  },
  {
    name: 'Title',
    maxWidth: '300px',
    selector: (row) => `${row.title}`,
    sortable: true,
  },
  {
    name: 'Content',
    maxWidth: '1000px',
    selector: (row) => `${row.content}`,
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
              to={`/admin/market/partner/edit/${row._id}`}
              className="w-100"
              onClick={() => store.dispatch(getMarketPartner(row._id))}
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
