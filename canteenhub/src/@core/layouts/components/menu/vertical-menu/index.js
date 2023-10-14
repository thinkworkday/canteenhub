// ** React Imports
import { Fragment, useState, useRef } from 'react';

// ** Vertical Menu Items Array
import defaultNav from '@src/navigation/horizontal';
import vendorNav from '@src/navigation/horizontal/vendor';
import storeNav from '@src/navigation/horizontal/store';
import groupNav from '@src/navigation/horizontal/group';
import customerNav from '@src/navigation/horizontal/customer';

import { getLoggedUser } from '@utils';

// ** Third Party Components
import classnames from 'classnames';
import PerfectScrollbar from 'react-perfect-scrollbar';

// ** Vertical Menu Components
import VerticalMenuHeader from './VerticalMenuHeader';
import VerticalNavMenuItems from './VerticalNavMenuItems';

const Sidebar = (props) => {
  // ** Props
  const {
    menuCollapsed, routerProps, menu, currentActiveItem, skin, setMenuVisibility,
  } = props;

  // ** States
  const [groupOpen, setGroupOpen] = useState([]);
  const [groupActive, setGroupActive] = useState([]);
  const [activeItem, setActiveItem] = useState(null);

  // ** Menu Hover State
  const [menuHover, setMenuHover] = useState(false);

  // ** Ref
  const shadowRef = useRef(null);

  const loggedUser = getLoggedUser();
  let navItems;

  switch (loggedUser.role) {
    case 'vendor':
      navItems = vendorNav;
      break;
    case 'store':
      navItems = storeNav;
      break;
    case 'group':
      navItems = groupNav;
      break;
    case 'customer':
      navItems = customerNav;
      break;
    default:
      navItems = defaultNav;
      break;
  }

  // ** Function to handle Mouse Enter
  const onMouseEnter = () => {
    if (menuCollapsed) {
      setMenuHover(true);
    }
  };

  // ** Scroll Menu
  const scrollMenu = (container) => {
    if (shadowRef && container.scrollTop > 0) {
      if (!shadowRef.current.classList.contains('d-block')) {
        shadowRef.current.classList.add('d-block');
      }
    } else if (shadowRef.current.classList.contains('d-block')) {
      shadowRef.current.classList.remove('d-block');
    }
  };

  return (
    <>
      <div
        className={classnames('main-menu menu-fixed menu-accordion menu-shadow', {
          expanded: menuHover || menuCollapsed === false,
          'menu-light': skin !== 'semi-dark' && skin !== 'dark',
          'menu-dark': skin === 'semi-dark' || skin === 'dark',
        })}
        onMouseEnter={onMouseEnter}
        onMouseLeave={() => setMenuHover(false)}
      >
        {menu ? (
          menu(props)
        ) : (
          <>
            {/* Vertical Menu Header */}
            <VerticalMenuHeader setGroupOpen={setGroupOpen} menuHover={menuHover} {...props} />
            {/* Vertical Menu Header Shadow */}
            <div className="shadow-bottom" ref={shadowRef} />
            {/* Perfect Scrollbar */}
            <PerfectScrollbar
              className="main-menu-content"
              options={{ wheelPropagation: false }}
              onScrollY={(container) => scrollMenu(container)}
            >
              <ul className="navigation navigation-main pt-1">
                <VerticalNavMenuItems
                  items={navItems}
                  groupActive={groupActive}
                  setGroupActive={setGroupActive}
                  activeItem={activeItem}
                  setActiveItem={setActiveItem}
                  groupOpen={groupOpen}
                  setGroupOpen={setGroupOpen}
                  routerProps={routerProps}
                  menuCollapsed={menuCollapsed}
                  setMenuVisibility={setMenuVisibility}
                  menuHover={menuHover}
                  currentActiveItem={currentActiveItem}
                />
              </ul>
            </PerfectScrollbar>
          </>
        )}
      </div>
    </>
  );
};

export default Sidebar;
