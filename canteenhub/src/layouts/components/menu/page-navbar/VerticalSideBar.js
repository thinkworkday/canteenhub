// ** React Imports
import { useState } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { Settings, X } from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';
// ** Configs
import themeConfig from '@configs/themeConfig';
import { NavItem } from 'reactstrap';

const VerticalSideBar = (props) => {
  // ** State
  const { menuVisibility, activeItem, setMenuVisibility } = props;
  // ** Toggles Customizer
  const handleToggle = (e) => {
    e.preventDefault();
    setMenuVisibility(!menuVisibility);
  };
  return (
    <div
      className={classnames('customizer', {
        open: menuVisibility,
      })}
    >
      <PerfectScrollbar className="customizer-content" options={{ wheelPropagation: false }}>
        <div className="customizer-header px-2 pt-1 pb-0 position-relative">
          <span className="brand-logo">
            <img src={themeConfig.app.appLogoImage} alt="logo" height={35} />
          </span>
          <a href="true" className="customizer-close" onClick={handleToggle}>
            <X />
          </a>
        </div>

        <hr />

        <div className="px-2">
          <ul className="nav navbar-nav">
            <NavItem>
              <Link to="/parents-care" className={`d-flex align-items-center nav-link mobile-page-title ${(activeItem === '/parents-care') ? 'active' : ''}`}>
                <span className="mobile-header-title">For Parents / Care givers</span>
              </Link>
            </NavItem>
            <NavItem>
              <Link to="/for-schools" className={`d-flex align-items-center nav-link mobile-page-title ${(activeItem === '/for-schools') ? 'active' : ''}`}>
                <span className="mobile-header-title">For Schools</span>
              </Link>
            </NavItem>
            <NavItem>
              <Link to="/for-stores" className={`d-flex align-items-center nav-link mobile-page-title ${(activeItem === '/for-stores') ? 'active' : ''}`}>
                <span className="mobile-header-title">For Stores</span>
              </Link>
            </NavItem>
            <NavItem>
              <Link to="/register" className={`d-flex align-items-center nav-link mobile-page-title ${(activeItem === '/register') ? 'active' : ''}`}>
                <span className="mobile-header-title">Sign up</span>
              </Link>
            </NavItem>
            <NavItem>
              <Link to="/login" className={`d-flex align-items-center nav-link mobile-page-title ${(activeItem === '/login') ? 'active' : ''}`}>
                <span className="mobile-header-title">Login</span>
              </Link>
            </NavItem>
          </ul>
        </div>
      </PerfectScrollbar>
    </div>
  );
};

export default VerticalSideBar;
