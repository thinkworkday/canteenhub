// ** React Imports
import { Link } from 'react-router-dom';
// ** Custom Components

// ** Store & Actions
import { store } from '@store/storeConfig/store';

// ** Third Party Components
import {
  Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';

import {
  MoreVertical, Trash2, Archive,
} from 'react-feather';
import { getMenuItem } from '@store/actions/menu.actions';

const renderImage = (row) => {
  if (row.image) {
    return <div className="img-wrapper"><img src={row.image} alt="logo" className="" /></div>;
  }
  return (<></>);
};

const renderTags = (row) => {
  if (row.tags) {
    const tags = row.tags.map((item, i) => (
      <Badge key={`tag-${i}`} color="light-info">
        {item}
      </Badge>
    ));
    return tags;
  }
  return false;
};

const renderPrices = (row) => {
  if (row.prices && row.prices.length > 0) {
    const prices = row.prices.map((price, i) => (
      <Badge key={`price-${i}`} color={i % 2 === 0 ? 'light-success' : 'light-primary'}>
        {price.currency}
        {' '}
        $
        {Number(`${price.amount}`).toFixed(2).toLocaleString()}
      </Badge>
    ));
    return prices;
  }
  return '';
};

export const columns = (toggleDeleteRecordModal) => [
  {
    name: '',
    maxWidth: '80px',
    selector: (row) => renderImage(row),
  },
  {
    name: 'Name',
    selector: (row) => `${row.name}`,
    sortable: true,
  },
  {
    name: 'Type',
    selector: (row) => `${row.type}`,
    sortable: true,
  },
  // {
  //   name: 'Price',
  //   selector: (row) => (row.price ? `$${Number(`${row.price}`).toFixed(2).toLocaleString()}` : ''),
  //   sortable: true,
  // },
  {
    name: 'Price',
    selector: (row) => renderPrices(row),
  },
  {
    name: 'Tags',
    cell: (row) => renderTags(row),
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
              to={`/admin/menu-items/edit/${row._id}`}
              className="w-100"
              // onClick={() => { console.log('getMenuItem'); store.dispatch(getMenuItem(row.id)); }}
            >
              <Archive size={14} className="mr-50" />
              <span className="align-middle">Edit</span>
            </DropdownItem>

            <DropdownItem
              className="w-100"
              onClick={() => toggleDeleteRecordModal(row)}
            >
              <Trash2 size={14} className="mr-50" />
              <span className="align-middle">Delete</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </>
    ),
  },
];
