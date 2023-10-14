// ** React Imports
import { Fragment, useState, useRef } from 'react';

// ** Vertical Menu Items Array
import navigation from '@src/navigation/vertical';

// ** Third Party Components
import classnames from 'classnames';
import PerfectScrollbar from 'react-perfect-scrollbar';

// ** Vertical Menu Components
import VerticalMenuHeader from './VerticalMenuHeader';
import VerticalNavMenuItems from './VerticalNavMenuItems';

const Sidebar = (props) => {
  // ** Props
  const {
    menuCollapsed, routerProps, currentActiveItem, skin,
  } = props;

  // console.log(menu(props));

  // ** States
  const [groupOpen, setGroupOpen] = useState([]);
  const [groupActive, setGroupActive] = useState([]);
  const [activeItem, setActiveItem] = useState(null);

  // ** Menu Hover State
  const [menuHover, setMenuHover] = useState(false);

  // ** Ref
  const shadowRef = useRef(null);

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

        <>
          <VerticalMenuHeader setGroupOpen={setGroupOpen} menuHover={menuHover} {...props} />
          <div className="shadow-bottom" ref={shadowRef} />
          <PerfectScrollbar
            className="main-menu-content"
            options={{ wheelPropagation: false }}
            onScrollY={(container) => scrollMenu(container)}
          >
            <ul className="navigation navigation-main">
              <VerticalNavMenuItems
                items={navigation}
                groupActive={groupActive}
                setGroupActive={setGroupActive}
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                groupOpen={groupOpen}
                setGroupOpen={setGroupOpen}
                routerProps={routerProps}
                menuCollapsed={menuCollapsed}
                menuHover={menuHover}
                currentActiveItem={currentActiveItem}
              />
            </ul>
          </PerfectScrollbar>
        </>

      </div>
    </>
  );
};

export default Sidebar;
