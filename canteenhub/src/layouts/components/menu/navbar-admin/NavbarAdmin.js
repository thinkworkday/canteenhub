// ** Dropdowns Imports
import { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { headers } from '@configs/apiHeaders.js';
// ** Third Party Components
import {
  Menu, CheckCircle,
} from 'react-feather';
import { toast } from 'react-toastify';
import { NavItem, NavLink, CustomInput } from 'reactstrap';
import { getTestModeStatus } from '@store/actions/testMode.actions';
import AdminUserDropdown from './AdminUserDropdown';

// ** Third Party Components

const NavbarUser = (props) => {
  // ** Props
  const {
    menuCollapsed, setMenuVisibility, setGroupOpen, menuHover,
  } = props;

  const dispatch = useDispatch();
  const { testModeStatus } = useSelector((state) => state.testModes);
  const [testMode, setTestMode] = useState(testModeStatus);

  // ** Reset open group
  useEffect(() => {
    dispatch(getTestModeStatus());
    setTestMode(testModeStatus);
    if (!menuHover && menuCollapsed) setGroupOpen([]);
  }, [dispatch, testModeStatus, menuHover, menuCollapsed]);

  const handleTestMode = async (event) => {
    setTestMode(event.target.checked);
    await axios(`${process.env.REACT_APP_SERVER_URL}/api/testModes`, {
      method: 'POST',
      data: {
        status: event.target.checked,
      },
      headers,
    }).then(async (response) => {
      if (response) {
        dispatch(getTestModeStatus());
        toast.success(
          <>
            <CheckCircle className="mr-1 text-success" />
            Test Mode successfully Changed!
          </>, {
            hideProgressBar: true,
          }
        );
      }
    });
  };

  return (
    <>
      <ul className="navbar-nav d-xl-none d-flex align-items-center">
        <NavItem className="mobile-menu mr-auto">
          <NavLink className="nav-menu-main menu-toggle hidden-xs is-active" onClick={() => setMenuVisibility(true)}>
            <Menu className="ficon" />
          </NavLink>
        </NavItem>
      </ul>
      <ul className="nav navbar-nav justify-content-end align-items-center w-100 ">
        <CustomInput
          type="switch"
          id="testMode-1"
          name="testMode"
          onChange={(e) => handleTestMode(e)}
          label="Test Mode"
          inline
          checked={testMode}
        />
        <AdminUserDropdown />
      </ul>
    </>
  );
};
export default NavbarUser;
