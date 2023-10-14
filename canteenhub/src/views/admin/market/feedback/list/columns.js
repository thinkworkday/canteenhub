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

import { getMarketFeedback } from '@store/actions/market.actions';

export const columns = () => [
  {
    name: 'Name',
    maxWidth: '300px',
    selector: (row) => `${row.name}`,
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
              to={`/admin/market/feedback/edit/${row._id}`}
              className="w-100"
              onClick={() => store.dispatch(getMarketFeedback(row._id))}
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
