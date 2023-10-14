/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// ** React Imports
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux';
import { handleMenuHidden, handleContentWidth } from '@store/actions/layout';
import { getLoggedUser } from '@utils';

// ** Third Party Components
import classnames from 'classnames';
import { ArrowUp } from 'react-feather';
import ScrollToTop from 'react-scroll-up';
import { Navbar, NavItem, Button } from 'reactstrap';

// ** Configs
import themeConfig from '@configs/themeConfig';

// ** Custom Hooks
// import { useRTL } from '@hooks/useRTL';
import { useSkin } from '@hooks/useSkin';
import { useNavbarType } from '@hooks/useNavbarType';
import { useFooterType } from '@hooks/useFooterType';
import { useNavbarColor } from '@hooks/useNavbarColor';
import MenuComponent from '@layouts/components/menu/horizontal-menu';
import FooterComponent from '@layouts/components/footer';
import NavbarComponent from '@layouts/components/navbar';
import SidebarComponent from '@layouts/components/menu/vertical-menu';

// ** Custom Components
import AlertVerifyEmail from '@src/components/AlertVerifyEmail';

// ** Styles
import '@styles/base/core/menu/menu-types/horizontal-menu.scss';

const HorizontalLayout = (props) => {
  // ** Props
  const {
    children, navbar, footer, menu, currentActiveItem, routerProps,
  } = props;

  const loggedUser = getLoggedUser();
  const [menuVisibility, setMenuVisibility] = useState(false);

  // ** Hooks
  const [skin, setSkin] = useSkin();
  // const [isRtl, setIsRtl] = useRTL();
  const [navbarType, setNavbarType] = useNavbarType();
  const [footerType, setFooterType] = useFooterType();
  const [navbarColor, setNavbarColor] = useNavbarColor();

  // ** States
  const [isMounted, setIsMounted] = useState(false);
  const [navbarScrolled, setNavbarScrolled] = useState(false);

  // ** Store Vars
  const dispatch = useDispatch();
  const layoutStore = useSelector((state) => state.layout);

  // ** Vars
  // const { contentWidth } = layoutStore;
  const isHidden = layoutStore.menuHidden;

  // ** Handles Content Width
  // const setContentWidth = (val) => dispatch(handleContentWidth(val));

  // ** Handles Content Width
  // const setIsHidden = (val) => dispatch(handleMenuHidden(val));

  // ** UseEffect Cleanup
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
  };

  const navbarClasses = {
    floating: 'floating-nav',
    sticky: 'fixed-top',
  };

  const bgColorCondition = navbarColor !== '' && navbarColor !== 'light' && navbarColor !== 'white';

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={classnames(
        `wrapper horizontal-layout vertical-overlay-menu horizontal-menu ${navbarWrapperClasses[navbarType] || 'navbar-floating'} ${
          footerClasses[footerType] || 'footer-static'
        } menu-expanded ${menuVisibility ? 'menu-open' : 'menu-hide'}`
      )}
      {...(isHidden ? { 'data-col': '1-column' } : {})}
    >

      { loggedUser.emailVerified ? (<></>) : <AlertVerifyEmail user={loggedUser} /> }

      <Navbar
        expand="lg"
        className={classnames('header-navbar navbar-fixed align-items-center navbar-shadow navbar-brand-center', {
          'navbar-scrolled': navbarScrolled,
        })}
      >

        {!navbar && (
          <div className="navbar-header d-xl-block d-none">
            <ul className="nav navbar-nav">
              <NavItem>
                <Link to="/" className="navbar-brand">
                  <span className="brand-logo">
                    <img src={themeConfig.app.appLogoImage} alt="logo" />
                  </span>
                  <h2 className="brand-text mb-0">{themeConfig.app.appName}</h2>
                </Link>
              </NavItem>
            </ul>
          </div>
        )}

        <div className="navbar-container d-flex content justify-content-between">
          {navbar ? navbar({ skin, setSkin, setMenuVisibility }) : <NavbarComponent skin={skin} setSkin={setSkin} setMenuVisibility={setMenuVisibility} />}
        </div>
      </Navbar>
      {!isHidden ? (
        <div className="horizontal-menu-wrapper">
          <Navbar
            tag="div"
            expand="sm"
            light={skin !== 'dark'}
            dark={skin === 'dark' || bgColorCondition}
            className={classnames('header-navbar navbar-horizontal navbar-shadow menu-border', {
              [navbarClasses[navbarType]]: navbarType !== 'static',
              'floating-nav': (!navbarClasses[navbarType] && navbarType !== 'static') || navbarType === 'floating',
            })}
          >
            {menu ? (
              menu({ routerProps, currentActiveItem })
            ) : (
              <MenuComponent
                routerProps={routerProps}
                currentActiveItem={currentActiveItem}
                setMenuVisibility={setMenuVisibility}
              />
            )}
          </Navbar>
        </div>
      ) : null}

      {!isHidden ? (
        <SidebarComponent
          skin={skin}
          menu={menu}
          menuCollapsed
          // menuVisibility={menuVisibility}
          // setMenuCollapsed={setMenuCollapsed}
          setMenuVisibility={setMenuVisibility}
          routerProps={routerProps}
          currentActiveItem={currentActiveItem}
        />
      ) : null}

      {children}
      {/* Vertical Nav Menu Overlay */}
      <div
        className={classnames('sidenav-overlay', {
          show: menuVisibility,
        })}
        onClick={() => { setMenuVisibility(false); }}
      />
      {/* Vertical Nav Menu Overlay */}
      {/* {themeConfig.layout.customizer === true ? (
        <Customizer
          skin={skin}
          setSkin={setSkin}
          footerType={footerType}
          setFooterType={setFooterType}
          navbarType={navbarType}
          setNavbarType={setNavbarType}
          navbarColor={navbarColor}
          setNavbarColor={setNavbarColor}
          isRtl={isRtl}
          setIsRtl={setIsRtl}
          layout={props.layout}
          setLayout={props.setLayout}
          isHidden={isHidden}
          setIsHidden={setIsHidden}
          contentWidth={contentWidth}
          setContentWidth={setContentWidth}
          transition={props.transition}
          setTransition={props.setTransition}
          themeConfig={themeConfig}
        />
      ) : null} */}
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
export default HorizontalLayout;
