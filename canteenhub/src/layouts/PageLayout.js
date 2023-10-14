/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
// ** React Imports
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// ** Third Party Components
import Proptypes from 'prop-types';

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux';

// ** Third Party Components
import classnames from 'classnames';
import { ArrowUp } from 'react-feather';
import ScrollToTop from 'react-scroll-up';
import {
  Navbar, Button,
} from 'reactstrap';

// ** Configs
import '@styles/react/libs/swiper/swiper.scss';

// ** Custom Hooks
import CustomPageFooter from './components/FooterPage';
import NavbarPageComponent from './components/menu/page-navbar/NavbarPage';

// ** Styles
import '@styles/base/core/menu/menu-types/page-menu.scss';
import VerticalSideBar from './components/menu/page-navbar/VerticalSideBar';

const PageLayout = ({ scrollBehaviour, children, ...rest }) => {
  // ** States
  const [menuVisibility, setMenuVisibility] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMounted, setIsMounted] = useState(false);
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [showFooter, setShowFooter] = useState(false);

  // ** Vars
  const location = useLocation();
  useEffect(() => {
    if (menuVisibility && windowWidth < 1200) {
      setMenuVisibility(false);
    }
  }, [location]);

  const cleanup = () => {
    setIsMounted(false);
    setNavbarScrolled(false);
  };

  //* * ComponentDidMount
  useEffect(() => {
    setIsMounted(true);
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 65 && navbarScrolled === false) {
        setNavbarScrolled(true);
      }
      if (window.pageYOffset < 65) {
        setNavbarScrolled(false);
      }
    });
    return () => cleanup();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowFooter(true);
    }, 1000);
  }, []);

  const handleScrollToTop = () => {
    window.scroll({ top: 0, behavior: scrollBehaviour });
  };

  return (
    <div
      className={classnames(
        'wrapper page-layout page-menu navbar-sticky footer-static menu-expanded'
      )}
    >
      <Navbar
        expand="lg"
        className={classnames('header-navbar navbar-fixed align-items-center navbar-shadow navbar-brand-center', {
          'navbar-scrolled': navbarScrolled,
        })}
      >
        <div className="container">
          <div className="navbar-container d-flex content justify-content-between">
            <NavbarPageComponent menuVisibility={menuVisibility} setMenuVisibility={setMenuVisibility} />
          </div>
        </div>
      </Navbar>
      <div className="blank-page c-style">
        {children}
      </div>
      <VerticalSideBar menuVisibility={menuVisibility} activeItem={location.pathname} setMenuVisibility={setMenuVisibility} />
      { showFooter ? (
        <div className="container pt-2">
          <footer
            className={classnames('footer footer-light footer-static')}
          >
            <CustomPageFooter />
          </footer>
          {navbarScrolled ? (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <div className="scroll-to-top" onClick={handleScrollToTop} {...rest}>
              <ScrollToTop showUnder={300} style={{ bottom: '5%' }}>
                <Button className="btn-icon" color="primary">
                  <ArrowUp size={14} />
                </Button>
              </ScrollToTop>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
export default PageLayout;

// ** PropTypes
PageLayout.propTypes = {
  showOffset: Proptypes.number,
  children: Proptypes.any.isRequired,
  scrollBehaviour: Proptypes.oneOf(['smooth', 'instant', 'auto']),
};

PageLayout.defaultProps = {
  scrollBehaviour: 'smooth',
};
