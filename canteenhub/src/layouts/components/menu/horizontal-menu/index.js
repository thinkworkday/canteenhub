// ** React Imports
import { useState } from 'react';

import { getLoggedUser } from '@utils';

// ** Horizontal Menu Array
import defaultNav from '@src/navigation/horizontal';
import vendorNav from '@src/navigation/horizontal/vendor';
import storeNav from '@src/navigation/horizontal/store';
import groupNav from '@src/navigation/horizontal/group';
import customerNav from '@src/navigation/horizontal/customer';

// ** Horizontal Menu Components
import HorizontalNavMenuItems from './HorizontalNavMenuItems';

const HorizontalMenu = ({ currentActiveItem, routerProps }) => {
  // ** States
  const [activeItem, setActiveItem] = useState(null);
  const [groupActive, setGroupActive] = useState([]);
  const [openDropdown, setOpenDropdown] = useState([]);

  // Get the Usergroup
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

  // console.log(navItems);

  // ** On mouse enter push the ID to openDropdown array
  const onMouseEnter = (id) => {
    const arr = openDropdown;
    arr.push(id);
    setOpenDropdown([...arr]);
  };

  // ** On mouse leave remove the ID to openDropdown array
  const onMouseLeave = (id) => {
    const arr = openDropdown;
    arr.splice(arr.indexOf(id), 1);
    setOpenDropdown([...arr]);
  };

  // console.log('activeItem', activeItem);
  // console.log('currentActiveItem', currentActiveItem);

  return (
    <div className="navbar-container main-menu-content d-none d-sm-block">
      <ul className="nav navbar-nav d-none d-lg-flex justify-content-center" id="main-menu-navigation">
        <HorizontalNavMenuItems
          submenu
          items={navItems}
          activeItem={activeItem}
          groupActive={groupActive}
          routerProps={routerProps}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          openDropdown={openDropdown}
          setActiveItem={setActiveItem}
          setGroupActive={setGroupActive}
          setOpenDropdown={setOpenDropdown}
          currentActiveItem={currentActiveItem}
        />
      </ul>
    </div>
  );
};

export default HorizontalMenu;
