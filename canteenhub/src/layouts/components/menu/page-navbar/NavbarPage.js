/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/anchor-is-valid */
// ** Dropdowns Imports
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

// ** Third Party Components
import { Menu } from 'react-feather';
import { NavItem, NavLink } from 'reactstrap';

// ** Configs
import themeConfig from '@configs/themeConfig';

const NavbarPage = (props) => {
  // ** Props
  const {
    menuVisibility,
    setMenuVisibility,
  } = props;

  // const handleQuestion = (event) => {
  //   event.preventDefault();
  //   props.modalToggle();
  // };

  return (
    <>
      <div className="bookmark-wrapper d-flex align-items-center">
        <Link to="/" className="navbar-brand">
          <span className="brand-logo">
            <img src={themeConfig.app.appLogoImage} alt="logo" />
          </span>
        </Link>
      </div>
      <div className="main-menu-content d-page-none d-none d-sm-block">
        <ul className="nav navbar-nav">
          {/* <NavItem>
            <Link to="/parents-care" className="d-flex align-items-center nav-link">
              <span className="page-header-title">For Parents / Care givers</span>
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/for-schools" className="d-flex align-items-center nav-link">
              <span className="page-header-title">For Schools</span>
            </Link>
          </NavItem> */}
          {/* <NavItem className="d-flex align-items-center">
            <Link to="#" onClick={handleQuestion} className="d-flex align-items-center nav-link">
              <span className="page-header-title">Questions</span>
            </Link>
          </NavItem> */}
          <NavItem>
            <Link to="/register" className="align-items-center waves-effect mx-1 btn btn-light btn-sm page-header-width">
              <span className="page-header-title">Sign up</span>
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/login" className="align-items-center waves-effect btn btn-pink btn-sm page-header-width">
              <span className="page-header-title">Login</span>
            </Link>
          </NavItem>
        </ul>
      </div>
      <ul className="navbar-nav d-xl-none d-flex align-items-center">
        <NavItem className="mobile-menu mr-auto">
          <NavLink className="nav-menu-main menu-toggle hidden-xs is-active" onClick={() => setMenuVisibility(!menuVisibility)}>
            <Menu className="ficon" />
          </NavLink>
        </NavItem>
      </ul>
    </>
  );
};
export default NavbarPage;
