/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// ** React Imports
import { useEffect } from 'react';
import {
  NavLink, useLocation, Link, useHistory,
} from 'react-router-dom';

// ** Horizontal menu items array
import navigation from '@src/navigation/horizontal';

// ** Third Party Components
import { Button } from 'reactstrap';
import classnames from 'classnames';

// ** Utils
import { isNavLinkActive, search, getAllParents } from '@layouts/utils';
import { getLoggedUser } from '@utils';

const HorizontalNavMenuLink = ({
  item,
  setOpenDropdown,
  setGroupActive,
  activeItem,
  setActiveItem,
  routerProps,
  currentActiveItem,
  isChild,
}) => {
  // ** Conditional Link Tag, if item has newTab or externalLink props use <a> tag else use NavLink
  const LinkTag = item.externalLink ? 'a' : NavLink;

  // ** URL Vars
  const location = useLocation();
  const currentURL = location.pathname;
  const history = useHistory();

  const navLinkActive = isNavLinkActive(item.navLink, currentURL, routerProps);

  // ** Get parents of current items
  const searchParents = (navigation, currentURL) => {
    const parents = search(navigation, currentURL, routerProps); // Search for parent object
    const allParents = getAllParents(parents, 'id'); // Parents Object to Parents Array
    allParents.pop();
    return allParents;
  };
  // Get LoggedIn User
  const loggedUser = getLoggedUser();
  // ** Remove all items from OpenDropdown array
  const resetOpenDropdowns = () => setOpenDropdown([]);
  // ** On mount update active group array
  useEffect(() => {
    if (currentActiveItem !== null) {
      setActiveItem(currentActiveItem);
      const arr = searchParents(navigation, currentURL);
      setGroupActive([...arr]);
    }
  }, [location]);
  // const handleOrder = (itemNavLink) => {
  //   if (loggedUser.checkOldYear) {
  //     history.push('/customer/profiles');
  //   } else {
  //     history.push(itemNavLink);
  //   }
  //   history.push(itemNavLink);
  // };

  return (
    <li
      className={classnames('nav-item', item.class, {
        active: item.navLink === activeItem,
        disabled: item.disabled,
        'd-flex align-items-center': !!item.externalLink,
      })}
      onClick={resetOpenDropdowns}
    >

      {item.isCta ? (

        <Button.Ripple
          tag={Link}
          to={item.navLink}
          // onClick={() => handleOrder(item.navLink)}
          size="sm"
          color="accent"
          className="mx-1"
        >
          {item.title}
        </Button.Ripple>

      ) : (

        <LinkTag
          className={classnames('d-flex align-items-center', {
            'dropdown-item': isChild,
            'nav-link': !isChild,
            'btn btn-primary': !!item.externalLink,
          })}
          tag={LinkTag}
          target={item.newTab ? '_blank' : undefined}
          /*eslint-disable */
          {...(item.externalLink === true
            ? {
                href: item.navLink || '/'
              }
            : {
                to: item.navLink || '/',
                isActive: (match, location) => {
                  if (!match) {
                    return false
                  }

                  if (match.url && match.url !== '' && match.url === item.navLink) {
                    currentActiveItem = item.navLink
                  }
                }
              })}
        >
          {item.icon}

          <span>{item.title}</span>
        </LinkTag>

      )}

    </li>
  );
};

export default HorizontalNavMenuLink;
