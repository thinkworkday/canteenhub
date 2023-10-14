// ** React Imports
import { Link } from 'react-router-dom';

import { getInitials, getLoggedUser } from '@utils';

// ** Custom Components
import { DisplayStatus } from '@src/components/DisplayStatus';
import moment from 'moment';

// ** Third Party Components
import {
  Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';

import {
  MoreVertical, Trash2, Archive,
} from 'react-feather';
import AvatarGroup from '@components/avatar-group';

// ** Renders Role Columns
const renderRole = (row) => {
  const color = row.createdByModel === 'Administrator' ? 'light-secondary' : 'light-info';
  return (
    <span className="text-truncate text-capitalize align-middle">
      <Badge color={color} pill>
        {row.createdByModel}
      </Badge>
    </span>
  );
};

// ** Renders Config
const renderConfig = (row) => {
  const color = !row.menuParent ? 'light-secondary' : 'light-info';
  const label = !row.menuParent ? 'Default' : 'Variation';
  return (
    <span className="text-truncate text-capitalize align-middle">
      <Badge color={color} pill>
        {label}
      </Badge>
    </span>
  );
};

// ** Renders User Columns
const renderUser = (row) => {
  const createdByUser = [];
  createdByUser.push(row.createdBy);
  const avatarData = createdByUser.map((item) => ({
    content: getInitials(`${item && item.firstName ? item.firstName : 'Anonym'} ${item && item.lastName ? item.lastName : 'User'}`),
    size: 'sm',
    title: item && item.firstName ? item.firstName : 'Anonym User',
  }));

  return <AvatarGroup data={avatarData} />;
};

// ** Renders Status Columns
const renderStatus = (row) => (
  <DisplayStatus status={row.status} />
);

export const columns = (toggleDeleteRecordModal) => {
  const loggedUser = getLoggedUser();
  const { role } = loggedUser;

  const columns = [
    {
      name: 'Name',
      selector: 'name',
      cell: (row) => <Link to={`/${role}/menus/edit/${row._id}`}>{row.name}</Link>,
    },
    {
      name: 'Description',
      selector: (row) => `${row.description}`,
      sortable: true,
    },
    {
      name: 'Created User',
      sortable: true,
      cell: (row) => renderUser(row),
    },
    {
      name: role === 'admin' ? 'Role' : 'Configuration',
      sortable: true,
      cell: (row) => (role === 'admin' ? renderRole(row) : renderConfig(row)),
    },
    {
      name: 'Status',
      sortable: true,
      cell: (row) => renderStatus(row),
    },
    {
      name: 'Last Modified',
      sortable: true,
      selector: (row) => row.updatedAt,
      format: (row) => moment(row.updatedAt).fromNow(),
    },
    {
      name: 'Actions',
      width: '120px',
      cell: (row) => {
        const canEdit = (!!(loggedUser.role === 'admin' || (loggedUser.role === 'vendor' && (typeof row.menuParent !== 'undefined'))));
        return (
          <>
            {canEdit ? (
              <UncontrolledDropdown>
                <DropdownToggle tag="div" className="btn btn-sm">
                  <MoreVertical size={14} className="cursor-pointer action-btn" />
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem
                    tag={Link}
                    to={`/${loggedUser.role}/menus/edit/${row._id}`}
                    className="w-100"
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
            ) : (
              <UncontrolledDropdown>
                <DropdownToggle tag="div" className="btn btn-sm">
                  <MoreVertical size={14} className="cursor-pointer action-btn" />
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem
                    tag={Link}
                    to={`/${loggedUser.role}/menus/edit/${row._id}`}
                    className="w-100"
                  >
                    <span className="align-middle">View</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            )}

          </>
        );
      },
    },
  ];

  return (columns);
};
