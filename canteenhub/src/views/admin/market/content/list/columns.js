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

import { getMarketContent } from '@store/actions/market.actions';

// ** Renders Image Columns
const renderImage = (row) => {
  if (row.contentLogo) {
    return <img src={row.contentLogo} alt="logo" className="img-fluid" />;
  }
  return (<></>);
};

// ** Renders Role Columns
const renderPageType = (row) => {
  const pageObj = {
    land: {
      class: 'light-primary',
    },
    parents: {
      class: 'light-success',
    },
    schools: {
      class: 'light-info',
    },
    store: {
      class: 'light-warning',
    },
  };

  return (
    <span className="text-truncate text-capitalize align-middle">
      <Badge color={`${pageObj[row.pageType] ? pageObj[row.pageType].class : ''}`} pill>
        {row.pageType}
      </Badge>
    </span>
  );
};

export const columns = () => [
  {
    name: '',
    maxWidth: '100px',
    selector: (row) => renderImage(row),
  },
  {
    name: 'PageType',
    maxWidth: '150px',
    sortable: true,
    cell: (row) => renderPageType(row),
  },
  {
    name: 'Title',
    maxWidth: '350px',
    selector: (row) => `${row.title}`,
    sortable: true,
  },
  {
    name: 'SubTitle',
    maxWidth: '350px',
    selector: (row) => row.subTitle,
    sortable: true,
  },
  {
    name: 'Content',
    maxWidth: '500px',
    selector: (row) => row.content,
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
              to={`/admin/market/content/edit/${row._id}`}
              className="w-100"
              onClick={() => store.dispatch(getMarketContent(row._id))}
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
