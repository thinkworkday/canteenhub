/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// ** React Imports
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux';
import { handleContentWidth, handleMenuHidden } from '@store/actions/layout';

// ** Third Party Components
import classnames from 'classnames';
import { ArrowUp } from 'react-feather';
import ScrollToTop from 'react-scroll-up';
import { Navbar, Button } from 'reactstrap';

// ** Configs
import themeConfig from '@configs/themeConfig';

// ** Custom Components

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin';
import FooterComponent from '@layouts/components/footer';
import SidebarComponent from '@layouts/components/menu/vertical-menu';
import NavbarComponent from '@layouts/components/navbar';

// ** Styles
import '@styles/base/core/menu/menu-types/vertical-menu.scss';
import '@styles/base/core/menu/menu-types/vertical-overlay-menu.scss';

const VerticalLayout = (props) => {
  // ** Props
  const {
    children, navbar, footer, menu, routerProps, currentActiveItem,
  } = props;

  // ** Hooks
  const [skin, setSkin] = useSkin();

  // ** States
  const [isMounted, setIsMounted] = useState(false);
  const [menuVisibility, setMenuVisibility] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // ** Store Vars
  const dispatch = useDispatch();
  const layoutStore = useSelector((state) => state.layout);

  // ** Update Window Width
  const handleWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  // ** Vars
  const navbarType = 'sticky';
  const footerType = 'static';
  const navbarColor = 'white';

  const location = useLocation();
  // const { contentWidth } = layoutStore;
  const { menuCollapsed } = layoutStore;
  const isHidden = layoutStore.menuHidden;

  // ** Toggles Menu Collapsed
  // const setMenuCollapsed = (val) => dispatch(handleMenuCollapsed(val));

  // ** Handles Content Width
  // const setContentWidth = (val) => dispatch(handleContentWidth(val));

  // ** Handles Content Width
  // const setIsHidden = (val) => dispatch(handleMenuHidden(val));

  //* * This function will detect the Route Change and will hide the menu on menu item click
  useEffect(() => {
    if (menuVisibility && windowWidth < 1200) {
      setMenuVisibility(false);
    }
  }, [location]);

  //* * Sets Window Size & Layout Props
  useEffect(() => {
    if (window !== undefined) {
      window.addEventListener('resize', handleWindowWidth);
    }
  }, [windowWidth]);

  //* * ComponentDidMount
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // ** Vars
  const footerClasses = {
    static: 'footer-static',
    sticky: 'footer-fixed',
    hidden: 'footer-hidden',
  };

  const navbarWrapperClasses = {
    floating: 'navbar-floating',
    sticky: 'navbar-sticky',
    static: 'navbar-static',
    hidden: 'navbar-hidden',
  };

  const navbarClasses = {
    floating: 'floating-nav',
    sticky: 'fixed-top',
    static: 'navbar-static-top',
    hidden: 'd-none',
  };

  const bgColorCondition = navbarColor !== '' && navbarColor !== 'light' && navbarColor !== 'white';

  if (!isMounted) {
    return null;
  }
  return (
    <div
      className={classnames(
        `wrapper vertical-layout ${navbarWrapperClasses[navbarType] || 'navbar-floating'} ${
          footerClasses[footerType] || 'footer-static'
        }`,
        {
          // Modern Menu
          'vertical-menu-modern': windowWidth >= 1200,
          'menu-collapsed': menuCollapsed && windowWidth >= 1200,
          'menu-expanded': !menuCollapsed && windowWidth > 1200,

          // Overlay Menu
          'vertical-overlay-menu': windowWidth < 1200,
          'menu-hide': !menuVisibility && windowWidth < 1200,
          'menu-open': menuVisibility && windowWidth < 1200,
        }
      )}
      {...(isHidden ? { 'data-col': '1-column' } : {})}
    >
      {!isHidden ? (
        <SidebarComponent
          skin={skin}
          menu={menu}
          menuCollapsed={menuCollapsed}
          menuVisibility={menuVisibility}
          // setMenuCollapsed={setMenuCollapsed}
          setMenuVisibility={setMenuVisibility}
          routerProps={routerProps}
          currentActiveItem={currentActiveItem}
        />
      ) : null}

      <Navbar
        expand="lg"
        light={skin !== 'dark'}
        dark={skin === 'dark' || bgColorCondition}
        color={bgColorCondition ? navbarColor : undefined}
        // setMenuCollapsed={setMenuCollapsed}
        className={classnames(
          `header-navbar navbar align-items-center ${navbarClasses[navbarType] || 'floating-nav'} navbar-shadow`
        )}
      >
        <div className="navbar-container d-flex content">
          {navbar ? (
            navbar({ setMenuVisibility, skin, setSkin })
          ) : (
            <NavbarComponent setMenuVisibility={setMenuVisibility} skin={skin} setSkin={setSkin} />
          )}
        </div>
      </Navbar>

      {children}

      {/* Vertical Nav Menu Overlay */}
      <div
        className={classnames('sidenav-overlay', {
          show: menuVisibility,
        })}
        onClick={() => setMenuVisibility(false)}
      />
      {/* Vertical Nav Menu Overlay */}

      <footer
        className={classnames(`footer footer-light ${footerClasses[footerType] || 'footer-static'}`, {
          'd-none': footerType === 'hidden',
        })}
      >
        {footer ? (
          footer({ footerType, footerClasses })
        ) : (
          <FooterComponent footerType={footerType} footerClasses={footerClasses} />
        )}
      </footer>

      {themeConfig.layout.scrollTop === true ? (
        <div className="scroll-to-top">
          <ScrollToTop showUnder={300} style={{ bottom: '5%' }}>
            <Button className="btn-icon" color="primary">
              <ArrowUp size={14} />
            </Button>
          </ScrollToTop>
        </div>
      ) : null}
    </div>
  );
};

export default VerticalLayout;
