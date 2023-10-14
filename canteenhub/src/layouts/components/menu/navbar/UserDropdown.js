// ** React Imports
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// ** Custom Components
import Avatar from '@components/avatar';

// ** Utils
import { isUserLoggedIn, getLoggedUser } from '@utils';

// ** Store & Actions
import { useDispatch } from 'react-redux';
import { handleLogout } from '@store/actions/auth';

// ** Third Party Components
import {
  UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem,
} from 'reactstrap';
import {
  User, Power, DollarSign,
} from 'react-feather';

const UserDropdown = () => {
  // ** Store Vars
  const dispatch = useDispatch();

  // ** State
  const [userData, setUserData] = useState(null);

  const loggedUser = getLoggedUser();

  //* * ComponentDidMount
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem('userData')));
    }
  }, []);

  //* * Vars
  const userAvatar = (userData && userData.avatar) || null;
  const userName = (userData && userData.firstName) ? `${userData.firstName} ${userData.lastName}` : 'John Doe';

  const UserAvatar = (props) => {
    const { userAvatar, userName } = props;
    return (userAvatar) ? <Avatar img={userAvatar} status="online" /> : <Avatar color="secondary" content={userName} initials status="online" />;
  };

  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle href="/" tag="a" className="nav-link dropdown-user-link" onClick={(e) => e.preventDefault()}>
        <div className="user-nav d-sm-flex d-none">
          <span className="user-name font-weight-bold">{(userData && userData.firstName) || ''}</span>
          <span className="user-status">{(userData && userData.role === 'group') ? 'school' : userData?.role}</span>
          {/* <span className="user-status">{(userData && userData.role) || 'Admin'}</span> */}
        </div>
        <UserAvatar img={userAvatar} userName={userName} />
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem tag={Link} to={`/${loggedUser.role}/me`}>
          <User size={14} className="mr-75" />
          <span className="align-middle">My Profile</span>
        </DropdownItem>

        {userData && userData.role === 'customer' ? (
          <DropdownItem tag={Link} to="/customer/transactions/list">
            <DollarSign size={14} className="mr-75" />
            <span className="align-middle">Transactions</span>
          </DropdownItem>
        ) : ''}

        {/*
        <DropdownItem tag={Link} to="#" onClick={(e) => e.preventDefault()}>
          <CheckSquare size={14} className="mr-75" />
          <span className="align-middle">Tasks</span>
        </DropdownItem>
        <DropdownItem tag={Link} to="#" onClick={(e) => e.preventDefault()}>
          <MessageSquare size={14} className="mr-75" />
          <span className="align-middle">Chats</span>
        </DropdownItem> */}
        <DropdownItem divider />
        <DropdownItem tag={Link} to="/login" onClick={() => dispatch(handleLogout())}>
          <Power size={14} className="mr-75" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default UserDropdown;
