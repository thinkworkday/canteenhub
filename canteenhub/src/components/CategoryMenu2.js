/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {
  useState, useEffect, useRef, useCallback,
} from 'react';

import { useSelector } from 'react-redux';

import { ChevronDown, ChevronUp, X } from 'react-feather';
import classnames from 'classnames';

// const MAX_ITEMS = 10;
const BURGER_WIDTH = 100;

export default function Menu(props) {
  const selectedMenu = useSelector((state) => state.menus.selectedMenu);
  const { activeTab, setActiveTab } = props;

  // const { selectedMenu } = props;
  let itemsWidth = null;
  let visibleItemsWidth = 0;
  const [initvisibleItems, setInitvisibleItems] = useState(selectedMenu.menuData.map((menuCats, i) => (Object.keys(menuCats))).flat());
  const [visibleItems, setVisibleItems] = useState(initvisibleItems);
  const [hiddenItems, setHiddenItems] = useState([]);
  const [isShowMore, setIsShowMore] = useState(false);
  const menu = useRef();

  const handleOnResize = useCallback(() => {
    const { offsetWidth: menuWidth } = menu.current;

    if (visibleItemsWidth > menuWidth) {
      // Hide some menu items

      const newHiddenItems = [];
      const visibleItemsCopy = [...visibleItems];

      if (hiddenItems.length === 0) {
        visibleItemsWidth += BURGER_WIDTH;
      }

      let lastItemIndex = visibleItemsCopy.length;
      while (visibleItemsWidth > menuWidth) {
        lastItemIndex -= 1;
        const lastVisibleItem = visibleItemsCopy.pop();
        newHiddenItems.unshift(lastVisibleItem);
        visibleItemsWidth -= itemsWidth[lastItemIndex];
      }

      setHiddenItems([...newHiddenItems, ...hiddenItems]);
      setVisibleItems([...visibleItemsCopy]);
    } else if (hiddenItems.length > 0) {
      // Show some menu items

      const hiddenItemsCopy = [...hiddenItems];

      let firstItemIndex = visibleItems.length;
      let potentialNewWidth = visibleItemsWidth
        + itemsWidth[firstItemIndex]
        - (hiddenItems.length === 1 ? BURGER_WIDTH : 0);

      const newVisibleItems = [];
      while (potentialNewWidth < menuWidth) {
        const firstHiddenItem = hiddenItemsCopy.shift();
        newVisibleItems.push(firstHiddenItem);
        visibleItemsWidth = potentialNewWidth;

        // Try one more item
        firstItemIndex += 1;
        potentialNewWidth
          += itemsWidth[firstItemIndex]
          - (hiddenItemsCopy.length === 1 ? BURGER_WIDTH : 0);
      }

      if (newVisibleItems.length > 0) {
        setHiddenItems([...hiddenItemsCopy]);
        setVisibleItems([...visibleItems, ...newVisibleItems]);
      }
    }
  }, [visibleItems, hiddenItems]);

  useEffect(() => {
    // Update the document title using the browser API

    menu.current = document.querySelector('.category-nav');
    const { children: itemsElt } = menu.current;

    itemsWidth = [];
    for (let i = 0; i < itemsElt.length; ++i) {
      const { [i]: item } = itemsElt;
      const { marginLeft, marginRight } = window.getComputedStyle(item);
      const margin = parseFloat(marginLeft) + parseFloat(marginRight);
      const { offsetWidth: width } = item;
      itemsWidth.push(width + margin);
      visibleItemsWidth += width + margin;
    }

    window.addEventListener('resize', handleOnResize);

    return () => {
      window.removeEventListener('resize', handleOnResize);
    };
  }, [handleOnResize]);

  // useEffect(() => {
  //   setInitvisibleItems(initvisibleItems);
  //   console.log('selectedMenu changed');
  // }, [selectedMenu]);

  const handleCategoryClick = (item, i) => {
    setActiveTab(i);
  };

  const visItems = visibleItems.map((item, i) => (
    <div
      className={`item ${classnames({ active: activeTab === i })}`}
      key={item}
      onClick={() => handleCategoryClick(item, i)}
    >
      {item}
    </div>
  ));

  const hidItems = hiddenItems.map((i) => (
    <div className="item" key={i}>
      {i}
    </div>
  ));

  const handleMoreToggle = () => {
    setIsShowMore(!isShowMore);
  };

  const moreDropdown = hiddenItems.length > 0 ? (
    <div className="more-dropdown item " onClick={() => handleMoreToggle()}>
      { isShowMore ? (
        <div className="aaa">
          <div className="more-text">Less</div>
          <div className="more-icon"><ChevronUp size="18" /></div>
        </div>
      ) : (
        <div className="aaa">
          <div className="more-text">More</div>
          <div className="more-icon">
            <ChevronDown size="18" />
          </div>
        </div>
      )}
    </div>
  ) : null;
  const dropdownItems = hiddenItems.length > 0 ? (
    <div className="dropdown-items">
      <div className="items">{hidItems}</div>
    </div>
  ) : null;

  return (
    <div className="cat-navbar-wrapper">
      <div className="navbar">
        <div className="category-nav">
          {visItems}
          {moreDropdown}
          {isShowMore ? dropdownItems : null}
        </div>
      </div>
    </div>
  );
}
