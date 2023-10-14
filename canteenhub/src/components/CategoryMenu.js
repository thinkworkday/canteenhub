/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-invalid-this */
/* eslint-disable no-plusplus */
import React from 'react';
// import React, { useState, useEffect } from 'react';

// ** Store & Actions
// import { useSelector, useDispatch } from 'react-redux';

// import {
//   Alert, Button, Card, CardHeader, CardTitle, CardBody, CardText, ListGroupItem, Media, TabContent, TabPane, Nav, NavItem, NavLink, Col, Row, Dropdown, DropdownMenu, DropdownToggle, DropdownItem,
// } from 'reactstrap';

import { ChevronDown, ChevronUp, X } from 'react-feather';

const BURGER_WIDTH = 100;

// const selectedRecord = useSelector((state) => state.menus.selectedMenu);
// console.log('IN COMPOTNENT', selectedRecord);

class CategoryMenu extends React.Component {
  constructor(props) {
    super(props);
    this.itemsWidth = null;
    this.visibleItemsWidth = 0;

    const mapStateToProps = (state) => ({
      counter: state,
    });

    const visibleItems = this.props.items;

    // console.log('visibleItems', visibleItems);

    this.state = {
      visibleItems,
      hiddenItems: [],
      aaa: false,
      active: 0,
    };
  }

  componentDidMount() {
    this.menu = document.querySelector('.category-nav');

    const { children: itemsElt } = this.menu;

    this.itemsWidth = [];
    for (let i = 0; i < itemsElt.length; ++i) {
      const { [i]: item } = itemsElt;
      const { marginLeft, marginRight } = window.getComputedStyle(item);
      const margin = parseFloat(marginLeft) + parseFloat(marginRight);
      const { offsetWidth: width } = item;
      this.itemsWidth.push(width + margin);
      this.visibleItemsWidth += width + margin;
    }

    window.addEventListener('resize', this.handleOnResize);
    this.handleOnResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleOnResize);
  }

  handleOnResize = () => {
    const { hiddenItems, visibleItems } = this.state;
    const { menu: { offsetWidth: menuWidth } } = this;

    if (this.visibleItemsWidth > menuWidth) {
      // Hide some menu items
      const newHiddenItems = [];
      const visibleItemsCopy = [...visibleItems];

      if (hiddenItems.length === 0) {
        this.visibleItemsWidth += BURGER_WIDTH;
      }

      let lastItemIndex = visibleItemsCopy.length;
      while (this.visibleItemsWidth > menuWidth) {
        lastItemIndex -= 1;
        const lastVisibleItem = visibleItemsCopy.pop();
        newHiddenItems.unshift(lastVisibleItem);
        this.visibleItemsWidth -= this.itemsWidth[lastItemIndex];
      }
      this.setState({
        hiddenItems: [...newHiddenItems, ...hiddenItems],
        visibleItems: [...visibleItemsCopy],
      });
    } else if (hiddenItems.length > 0) {
      // Show some menu items

      const hiddenItemsCopy = [...hiddenItems];
      let firstItemIndex = visibleItems.length;
      let potentialNewWidth = this.visibleItemsWidth
        + this.itemsWidth[firstItemIndex]
        - (hiddenItems.length === 1 ? BURGER_WIDTH : 0);

      const newVisibleItems = [];
      while (potentialNewWidth < menuWidth) {
        const firstHiddenItem = hiddenItemsCopy.shift();
        newVisibleItems.push(firstHiddenItem);
        this.visibleItemsWidth = potentialNewWidth;

        // Try one more item
        firstItemIndex += 1;
        potentialNewWidth
          += this.itemsWidth[firstItemIndex]
          - (hiddenItemsCopy.length === 1 ? BURGER_WIDTH : 0);
      }

      if (newVisibleItems.length > 0) {
        this.setState({
          hiddenItems: [...hiddenItemsCopy],
          visibleItems: [...visibleItems, ...newVisibleItems],
        });
      }
    }
  };

  handleMoreToggle = () => {
    this.setState({
      aaa: !this.state.aaa,
    });
  }

  handleCategoryClick = (i) => {
    this.props.toggle(i);
    this.setState({
      active: i,
    });
  }

  render() {
    const {
      hiddenItems, visibleItems, aaa, active,
    } = this.state;

    const visItems = visibleItems.map((item, i) => {
      // const itemClass = (active && active === i) ? 'item active' : 'item';
      const itemClass = 'item';
      return (
        <div className={itemClass} id={`cat-${i}`} key={i} onClick={() => this.handleCategoryClick(i)}>
          {item}
        </div>
      );
    });

    const hidItems = hiddenItems.map((item, i) => {
      const itemNumber = i + visItems.length;
      return (
        <li className="item" key={i} onClick={() => this.handleCategoryClick(itemNumber)}>
          {item}
        </li>
      );
    });

    const moreDropdown = hiddenItems.length > 0 ? (
      <>

        <div className="more-dropdown item" onClick={() => this.handleMoreToggle()}>
          { aaa ? (
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

      </>
    ) : null;
    const dropdownItems = hiddenItems.length > 0 ? (
      <div className="dropdown-items">
        <div className="items">{hidItems}</div>
      </div>
    ) : null;

    return (
      <div className="cat-navbar-wrapper">
        <div className="navbar">
          <ul className="category-nav nav nav-pills ">
            {visItems}
            {moreDropdown}
            {aaa ? dropdownItems : null}
          </ul>
        </div>
      </div>
    );
  }
}

export default CategoryMenu;
