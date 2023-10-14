// ** Third Party Components
import {
  Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';
import {
  MoreVertical, Trash2, Archive, CheckSquare,
} from 'react-feather';

const renderType = (row) => (row.multiSelect ? (
  <Badge key={row._id} color="light-info">multiSelect</Badge>
) : (
  <></>
));

// ** Renders Role Columns
const renderRole = (row) => {
  const color = row.createdByModel === 'Administrator' ? 'light-primary' : 'light-info';
  return (
    <span className="text-truncate text-capitalize align-middle">
      <Badge color={color} pill>
        {row.createdByModel}
      </Badge>
    </span>
  );
};

const renderOptions = (row) => (
  <div className="d-flex flex-column">
    <div>
      {row.name}
      {' '}
      {row.mandatory ? <small className="text-primary">*</small> : ''}
    </div>
    <small className="text-muted">
      {row.options ? `${row.options.length} options` : ''}

    </small>

  </div>
);

export const columns = (toggleEditOptionModal, toggleDeleteRecordModal) => [
  {
    name: 'Name',
    cell: (row) => renderOptions(row),
  },
  {
    name: 'Type',
    cell: (row) => renderType(row),
  },
  {
    name: 'Created by',
    sortable: true,
    cell: (row) => renderRole(row),
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
              className="w-100"
              onClick={() => toggleEditOptionModal(row)}
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
