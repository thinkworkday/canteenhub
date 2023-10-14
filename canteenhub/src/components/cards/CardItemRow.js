// import { Link } from 'react-router-dom';

// import Chart from 'react-apexcharts';
import { CheckCircle } from 'react-feather';
// import classnames from 'classnames';

import { priceFormatter } from '@utils';

import {
  Media, Badge,
} from 'reactstrap';
// import CardFooter from 'reactstrap/lib/CardFooter';

const CardItemButton = ({
  item, index, handleMenuItemClick, itemsSelected, size, isCustomerFacing = false, currentOrder, currentCurrency, loggedUserRole,
}) => {
  if (!item) {
    return false;
  }

  const isActive = itemsSelected && itemsSelected.includes(item._id) ? 'active' : '';

  let itemCartStatus = 0;
  if (isCustomerFacing && currentOrder) {
    itemCartStatus = currentOrder.orderLines.map((orderLine, index) => {
      if (item._id === orderLine._id) {
        return orderLine.qty;
      }
      return 0;
    });
  }

  const cartQty = itemCartStatus ? itemCartStatus.reduce((partialSum, a) => partialSum + a, 0) : 0;

  return (
    <div
      key={index}
      tabIndex={index}
      role="button"
      className={`btn-row ${isActive}`}
      onClick={() => handleMenuItemClick(item._id)}
      onKeyDown={() => handleMenuItemClick(item._id)}
    >
      <Media className="justify-content-between align-items-center">
        <div className="d-flex">
          <img src={item.image} alt={item.name} className={size} />
          {cartQty > 0 ? (
            <Badge color="success" className="item-qty">
              {cartQty}
            </Badge>
          ) : ''}

          <div className="item-title ">
            <p className="mb-0">
              {item.name}
              {' '}
              (
              {size === 'sm' ? (
                <small className="mb-0 mt-1">
                  {item.prices?.map((price, index) => (
                    // eslint-disable-next-line no-nested-ternary
                    <span key={index} className={loggedUserRole === 'admin' ? '' : price.currency !== currentCurrency ? 'd-none' : ''}>
                      <span className={index % 2 === 0 ? 'badge badge-sm badge-light-primary' : 'badge badge-sm badge-light-success'}>
                        {price.currency}
                      </span>
                      <span>
                        {priceFormatter(price.amount)}
                      </span>
                      {index !== item.prices.length - 1 && ' '}
                    </span>
                  ))}
                </small>
              ) : (
                <p className="mb-0 mt-1">
                  {item.prices?.map((price, index) => (
                    // eslint-disable-next-line no-nested-ternary
                    <span key={index} className={loggedUserRole === 'admin' ? '' : price.currency !== currentCurrency ? 'd-none' : ''}>
                      <span className={index % 2 === 0 ? 'badge badge-sm badge-light-primary' : 'badge badge-sm badge-light-success'}>
                        {price.currency}
                      </span>
                      <span>
                        {priceFormatter(price.amount)}
                      </span>
                      {index !== item.prices.length - 1 && ' '}
                    </span>
                  ))}
                </p>
              )}
              )
            </p>
            <small className="d-block text-muted">{item.description}</small>
          </div>
        </div>

        <div className="d-flex">

          {!isCustomerFacing && item.tags ? item.tags.map((tag, i) => (
            <Badge color="light-primary" className="badge-sm inline" key={`tag-${i}`}>
              {tag}
            </Badge>
          )) : <></>}
          <div className="item-price mr-1" />

        </div>
        {/* <Media body className="item-detail-wrapper">
          <div className="item-title ">
            <h6 className="mb-0">{item.name}</h6>
          </div>

          {item.description ? (
            <small className="d-block text-muted item-description">
              {item.description}
            </small>
          ) : <></> }
          <div className="item-price">
            {size === 'sm' ? <small className="mb-0 mt-1">{priceFormatter(item.price)}</small> : <p className="mb-0 mt-1">{priceFormatter(item.price)}</p>}
          </div>
          {!isCustomerFacing && item.tags ? item.tags.map((tag, i) => (
            <Badge color="light-primary" className="badge-sm inline" key={i}>
              {tag}
            </Badge>
          )) : <></>}
        </Media> */}
      </Media>
      <CheckCircle size={32} className="check-notificaiton d-none" />
    </div>
  );
};

export default CardItemButton;
