/* eslint-disable react/jsx-key */
// import { Link } from 'react-router-dom';

// import Chart from 'react-apexcharts';
import { CheckCircle } from 'react-feather';
// import classnames from 'classnames';

// ** Utils
import { priceFormatter, getUserData } from '@utils';
import { fetchItemPrice } from '@src/utility/functions/menus';

import {
  Media, Badge,
} from 'reactstrap';
// import CardFooter from 'reactstrap/lib/CardFooter';

const CardItemButton = ({
  item, menu, index, handleMenuItemClick, itemsSelected, size, isCustomerFacing = false, currentOrder, currentCurrency,
}) => {
  if (!item) {
    return false;
  }

  const isActive = itemsSelected && itemsSelected.includes(item._id) ? 'active' : '';
  const loggedUser = getUserData();

  let itemCartStatus = 0;
  if (isCustomerFacing && currentOrder && currentOrder.orderLines) {
    itemCartStatus = currentOrder.orderLines.map((orderLine) => {
      if (item._id === orderLine._id) {
        return orderLine.qty;
      }
      return 0;
    });
  }

  // get item price
  const itemPriceObj = loggedUser.role === 'admin' ? fetchItemPrice(item, menu) : fetchItemPrice(item, menu).filter((itemP) => itemP.itemCurrency === currentCurrency);
  // get qty
  const cartQty = itemCartStatus ? itemCartStatus.reduce((partialSum, a) => partialSum + a, 0) : 0;

  return (
    <div
      key={index}
      tabIndex={index}
      role="button"
      className={`btn-item ${isActive}`}
      onClick={() => handleMenuItemClick(item._id)}
      onKeyDown={() => handleMenuItemClick(item._id)}
    >
      <Media className="align-items-center">
        <img src={item.image} alt={item.name} className={size} />
        {cartQty > 0 ? (
          <Badge color="success" className="item-qty">
            {cartQty}
          </Badge>
        ) : ''}
        <Media body className="item-detail-wrapper">
          <div className="item-title ">
            <h6 className="mb-0">{item.name}</h6>
            {/* {item.type !== 'type' && item.options && item.options.length > 0 ? (
              <small>
                {item.options.length}
                {' '}
                option(s)
              </small>
            ) : ''} */}
          </div>

          {item.description ? (
            <small className="d-block text-muted item-description">
              {item.description}
            </small>
          ) : <></>}
          <div className="item-price">
            {size === 'sm' ? (
              <small className="mb-0 mt-1">
                {itemPriceObj.map((itemPriceOb, index) => (
                  itemPriceOb.priceCustom ? (
                    <div key={index} className="d-flex align-items-center" style={{ paddingTop: '1px', paddingBottom: '1px' }}>
                      <span className={`${index % 2 === 0 ? 'badge-light-primary' : 'badge-light-success'} badge-sm inline badge`}>{itemPriceOb.itemCurrency}</span>
                      {' '}
                      <strike className="text-muted">{priceFormatter(itemPriceOb.itemPriceOrig)}</strike>
                      {' '}
                      {priceFormatter(itemPriceOb.itemPrice)}
                    </div>
                  ) : (
                    <div key={index} className="d-flex align-items-center" style={{ paddingTop: '1px', paddingBottom: '1px' }}>
                      <span className={`${index % 2 === 0 ? 'badge-light-primary' : 'badge-light-success'} badge-sm inline badge`}>{itemPriceOb.itemCurrency}</span>
                      {' '}
                      {priceFormatter(itemPriceOb.itemPriceOrig)}
                    </div>
                  )
                ))}
              </small>
            ) : (
              <small className="mb-0 mt-1">
                {itemPriceObj.map((itemPriceOb, index) => (
                  itemPriceOb.priceCustom ? (
                    <div key={index} className="d-flex align-items-center" style={{ paddingTop: '1px', paddingBottom: '1px' }}>
                      <span className={`${index % 2 === 0 ? 'badge-light-primary' : 'badge-light-success'} badge-sm inline badge`}>{itemPriceOb.itemCurrency}</span>
                      {' '}
                      {' '}
                      {priceFormatter(itemPriceOb.itemPrice)}
                    </div>
                  ) : (
                    <div key={index} className="d-flex align-items-center" style={{ paddingTop: '1px', paddingBottom: '1px' }}>
                      <span className={`${index % 2 === 0 ? 'badge-light-primary' : 'badge-light-success'} badge-sm inline badge`}>{itemPriceOb.itemCurrency}</span>
                      {' '}
                      {priceFormatter(itemPriceOb.itemPriceOrig)}
                    </div>
                  )
                ))}
              </small>
            )}
          </div>
          {!isCustomerFacing && item.tags ? item.tags.map((tag, i) => (
            <Badge color="light-info" className="badge-sm inline" key={i}>
              {tag}
            </Badge>
          )) : <></>}
        </Media>
      </Media>
      <CheckCircle size={32} className="check-notificaiton d-none" />
    </div>
  );
};

export default CardItemButton;
