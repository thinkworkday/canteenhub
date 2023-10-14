/* eslint-disable consistent-return */
/* eslint-disable react/jsx-no-undef */
import { useState, useEffect } from 'react';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';
import { getMenuItem } from '@store/actions/menu.actions';
import { updateCartOrder } from '@store/actions/cart.actions';

// ** Reactstrap
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardImg, CardBody, CardText, Spinner, FormGroup, Label, CustomInput, Alert,
} from 'reactstrap';

// ** Components
import Select from 'react-select';

// ** Utils
import { calculateOrderTotals, isObjEmpty, priceFormatter } from '@utils';
import { fetchItemPrice } from '@src/utility/functions/menus';

import { cartQtyOptionsAdd, qtySelectStylesLg } from '@src/models/constants/qtyOptions';
// import { combineReducers } from 'redux';

// ** Third Party Components
import UILoader from '@components/ui-loader';

// import { Search } from 'react-feather';

// ** Gets the line index
const fetchLineIndex = (currentOrder, selectedItem) => {
  // eslint-disable-next-line consistent-return
  const isFound = currentOrder?.orderLines.find((orderLine) => {
    if (orderLine._id && (orderLine._id === selectedItem)) {
      return true;
    }
  });
  const orderLineIndex = currentOrder?.orderLines.findIndex((x) => x === isFound);
  return (orderLineIndex);
};

// ** Gets the line qty from current order
const fetchQty = (currentOrder, selectedItem) => {
  const lineIndex = fetchLineIndex(currentOrder, selectedItem);
  const lineQty = currentOrder?.orderLines[lineIndex] ? currentOrder?.orderLines[lineIndex].qty : 0;
  return (lineIndex >= 0 ? { value: lineQty, label: lineQty } : { value: 1, label: 1 });
};

// ** Gets the line subtotal from current order
// const fetchSubtotal = (currentOrder, selectedItem) => {
//   const lineIndex = fetchLineIndex(currentOrder, selectedItem);
//   const lineSubtotal = currentOrder?.orderLines[lineIndex] ? currentOrder?.orderLines[lineIndex].qty * currentOrder?.orderLines[lineIndex].price : 0;
//   return (lineIndex >= 0 ? lineSubtotal : 0);
// };

// ** Modal Component
const ModalAddToCart = (props) => {
  const { selectedItem, menu } = props;

  const productItem = useSelector((state) => state.records.selectedRecord); // product item
  const currentOrder = useSelector((state) => state.cart.selectedOrder); // current order'

  const unavailableMenuOptions = menu && menu.menuOptionModifications[0] && menu.menuOptionModifications[0].unavailableMenuOptions ? menu.menuOptionModifications[0].unavailableMenuOptions : {};

  const dispatch = useDispatch();

  // ** States
  // const [modalClosed, setModalClosed] = useState(false);

  const [itemPriceObj, setItemPrice] = useState({});
  const [isProcessing, setProcessing] = useState(false);
  const [options, setOptions] = useState([]);
  const [optionErrors, setOptionErrors] = useState([]);
  const [qty, setQty] = useState({});
  const [subtotal, setSubtotal] = useState({});

  // ** Get data on modal load
  useEffect(() => {
    if (selectedItem) {
      dispatch(getMenuItem(selectedItem)); // get menu item from DB
      // dispatch(getMenuItem(selectedItem)); // get menu item from DB
      setQty(fetchQty(currentOrder, selectedItem));

      // setSubtotal(fetchSubtotal(currentOrder, selectedItem));
    }
  }, [selectedItem]);

  // ** Get prices
  useEffect(() => {
    setItemPrice(productItem && menu ? fetchItemPrice(productItem, menu) : {});
  }, [productItem, menu]);

  // ** Get subtotal
  useEffect(() => {
    if (itemPriceObj.length > 0) {
      const itemPriceData = itemPriceObj.find((itemPrice) => itemPrice.itemCurrency === props.currentCurrency);
      let subTotalValue = 0;
      if (itemPriceData) {
        if (itemPriceData.itemPrice) {
          subTotalValue = itemPriceData.itemPrice;
        } else {
          subTotalValue = itemPriceData.itemPriceOrig;
        }
      } else if (itemPriceObj[0].itemPrice) {
        subTotalValue = itemPriceObj[0].itemPrice;
      } else {
        subTotalValue = itemPriceObj[0].itemPriceOrig;
      }
      setSubtotal(subTotalValue);
    }
  }, [itemPriceObj]);

  const handleClose = async () => {
    setProcessing(true);
    setOptions([]);
    // setQty({ value: 1, label: 1 });
    // setSubtotal(productItem?.price);
    setProcessing(false);
  };

  // Get Checked Values
  const getCheckedBoxes = (chkboxName) => {
    const checkboxes = document.getElementsByName(chkboxName);
    const checkboxesChecked = [];
    for (let i = 0; i < checkboxes.length; i += 1) {
      if (checkboxes[i].checked) {
        checkboxesChecked.push(checkboxes[i]);
      }
    }

    // Return the array if it is non-empty, or null
    // return checkboxesChecked.length > 0 ? checkboxesChecked : null;
    const checkedValues = checkboxesChecked.length > 0 ? checkboxesChecked.map((checkboxField) => ({ name: checkboxField.dataset.name, price: checkboxField.dataset.price })) : [];
    return checkedValues;
  };

  const setItemCartPrice = (selectedQty) => {
    const selectedOptions = options.filter((el) => el.optionsSelected.length > 0);
    const extrasSubtotal = selectedOptions.map((selectedOption) => selectedOption.optionsSelected.reduce((a, b) => +a + +b.price, 0)).reduce((a, b) => a + b, 0);
    const itemPriceData = itemPriceObj.find((itemPrice) => itemPrice.itemCurrency === props.currentCurrency);
    let subItemPrice = 0;
    if (itemPriceData) {
      if (itemPriceData.itemPrice) {
        subItemPrice = itemPriceData.itemPrice;
      } else {
        subItemPrice = itemPriceData.itemPriceOrig;
      }
    } else if (itemPriceObj[0].itemPrice) {
      subItemPrice = itemPriceObj[0].itemPrice;
    } else {
      subItemPrice = itemPriceObj[0].itemPriceOrig;
    }
    setSubtotal(selectedQty * (subItemPrice + extrasSubtotal));
  };

  // ** Handle Option Click
  const handleOptionChange = async (e, optionGroup) => {
    const checkedValues = getCheckedBoxes(`option-${optionGroup._id}`, optionGroup);

    // check if in option (state) already
    // eslint-disable-next-line consistent-return
    const isFound = options.find((e) => {
      if (e.optionId === optionGroup._id) {
        return true;
      }
    });
    const orderLineIndex = options.findIndex((x) => x === isFound);

    if (isFound) {
      options[orderLineIndex].optionsSelected = checkedValues;
    } else {
      options.push({ optionId: optionGroup._id, optionGroupName: optionGroup.name, optionsSelected: checkedValues });
    }
    setOptions(options);

    // handle subtotals
    setItemCartPrice(qty.value);
  };

  // ** Update cart
  const handleQtyChange = async (selectedQty) => {
    setProcessing(true);
    setQty(selectedQty);
    // setSubtotal(selectedQty.value * lineItemPrice);
    setItemCartPrice(selectedQty.value);
    setProcessing(false);
  };

  // ** Update cart
  const cartAddNewItem = (currentCart, newItem, qty) => {
    const { orderLines, profile } = currentCart;

    // const hasOptions = newItem.options.length > 0;
    // if (hasOptions) {
    //   console.log('SETUP OPTIONS:', newItem.options);
    // }

    // check if new item is in cart
    // eslint-disable-next-line consistent-return
    // const isFound = orderLines.find((orderLine, index) => {
    //   if (orderLine._id === newItem._id) {
    //     return true;
    //   }
    // });

    // const isFound = false;
    // if (isFound) { // Temp off
    //   // ALreafy in cart - update instead of add
    //   const orderLineIndex = currentOrder.orderLines.findIndex((x) => x === isFound);
    //   orderLines[orderLineIndex].qty = qty;
    //   orderLines[orderLineIndex].subtotal = subtotal;
    // } else {
    const itemPriceData = itemPriceObj.find((itemPrice) => itemPrice.itemCurrency === props.currentCurrency);
    let itemPrice = 0;
    if (itemPriceData) {
      if (itemPriceData.itemPrice) {
        itemPrice = itemPriceData.itemPrice;
      } else {
        itemPrice = itemPriceData.itemPriceOrig;
      }
    } else if (itemPriceObj[0].itemPrice) {
      itemPrice = itemPriceObj[0].itemPrice;
    } else {
      itemPrice = itemPriceObj[0].itemPriceOrig;
    }
    // add qty
    newItem.qty = qty;
    newItem.price = itemPrice;
    newItem.currency = props.currentCurrency;
    newItem.priceExtras = (subtotal / qty) - itemPrice;
    newItem.priceEach = (subtotal / qty);
    const [first] = profile;
    newItem.profile = first;
    newItem.events = currentCart.events;

    // add options
    newItem.options = options;

    // add subtotal
    newItem.subtotal = subtotal;

    // remove unwanted fields
    delete newItem.prices;
    delete newItem.createdBy;
    delete newItem.createdByModel;
    delete newItem.status;
    delete newItem.createdAt;
    delete newItem.__v;
    delete newItem.tags;
    delete newItem.type;

    orderLines.push(newItem);

    return orderLines;
  };

  const onSubmit = async () => {
    // check mandatory
    const mandatoryOptions = productItem.options.filter((el) => el.mandatory === true);
    const selectedOptions = options.filter((el) => el.optionsSelected.length > 0);

    let optionErrorIds = mandatoryOptions.map((mandatoryOption) => {
      const optionIsSelected = selectedOptions.some((o) => o.optionId === mandatoryOption._id);
      return optionIsSelected ? null : mandatoryOption._id;
    });
    optionErrorIds = optionErrorIds.filter((x) => x != null);
    setOptionErrors(optionErrorIds);
    if (isObjEmpty(optionErrorIds)) {
      setProcessing(true);
      const orderLines = await cartAddNewItem(currentOrder, productItem, qty.value);
      const orderTotals = await calculateOrderTotals(currentOrder);
      // console.log('orderLines', orderLines);
      // console.log('orderTotals', orderTotals);

      try {
        await dispatch(updateCartOrder(currentOrder._id, { orderLines, orderTotals }));
        await dispatch(getMenuItem(selectedItem));
        setOptions([]);
        props.modalToggle();
        props.setBackDisabled(true);
        setProcessing(false);
      } catch (err) {
      // eslint-disable-next-line no-console
        console.log('ERROR', err);
        setProcessing(false);
      }
    } else {
      props.modalValidToggle();
    }
  };

  const renderOptionFields = (productItem) => {
    if (!productItem) { return null; }

    const optionGroups = productItem.options.map((optionGroup, i) => {
      let options = [];
      if (optionGroup.options) {
        const optionsFiltered = unavailableMenuOptions && unavailableMenuOptions.length > 0 ? optionGroup.options.filter((option) => !unavailableMenuOptions.includes(option.id)) : optionGroup.options;

        options = optionsFiltered.map((option, i2) => (
          <div key={i2} className="option-wrapper d-flex align-content-center">
            {optionGroup.multiSelect ? (
              <CustomInput
                type="checkbox"
                name={`option-${optionGroup._id}`}
                id={`option-${option.name}-${i2}`}
                onChange={(e) => handleOptionChange(e, optionGroup)}
                data-name={option.name}
                data-price={option.price}
              />
            ) : (
              <CustomInput
                type="radio"
                name={`option-${optionGroup._id}`}
                id={`option-${option.name}-${i2}`}
                onChange={(e) => handleOptionChange(e, optionGroup)}
                data-name={option.name}
                data-price={option.price}
              />
            )}

            <Label for={`option-${option.name}-${i2}`} check>
              <div>
                <span>{option.name}</span>
                {option.price ? (
                  <small className="text-muted ml-1">
                    +
                    {priceFormatter(option.price)}
                  </small>
                ) : '' }
              </div>
            </Label>
          </div>
        ));
      }
      return (
        <div key={i} className="option-group-wrapper">
          <div className="option-group-name">
            {optionGroup ? optionGroup.name : '' }
            {' '}
            {optionGroup.mandatory ? <span className="text-primary">*</span> : ''}
            { optionErrors.includes(optionGroup._id) ? <span className="text-primary font-weight-light ml-1">mandatory</span> : ''}
          </div>
          <FormGroup check>
            {options}
          </FormGroup>

        </div>

      );
    });

    return optionGroups;
  };

  return (
    <Modal scrollable isOpen={props.modalVisibility} onClosed={() => handleClose()} className="modal-add-to-cart" toggle={() => props.modalToggle()}>
      <ModalHeader className="justify-content-center" toggle={() => props.modalToggle()}>{productItem?.name}</ModalHeader>
      <ModalBody className="p-0">
        <Card className="card-add-to-cart">
          <CardImg top src={productItem?.image} alt="Card cap" />
          <CardBody>
            <CardText>
              {productItem?.description}
            </CardText>
            <UILoader blocking={isProcessing}>
              {productItem?.options ? renderOptionFields(productItem) : ''}
            </UILoader>
          </CardBody>
        </Card>
      </ModalBody>
      <ModalFooter className="justify-content-center shadow">
        <Select
          styles={qtySelectStylesLg}
          className="react-select"
          defaultValue={qty}
          options={cartQtyOptionsAdd}
          isClearable={false}
          components={{
            IndicatorSeparator: () => null,
          }}
          menuPlacement="top"
          onChange={(e) => handleQtyChange(e, itemPriceObj?.price)}
        />
        <Button color="primary" className="btn-add-to-cart d-flex" onClick={() => onSubmit()} disabled={isProcessing}>
          {isProcessing && (
          <div className="d-flex align-items-center mr-1">
            <Spinner color="light" size="sm" />
          </div>
          )}
          Add for
          {' '}
          {priceFormatter(subtotal)}
        </Button>

      </ModalFooter>
    </Modal>
  );
};

export default ModalAddToCart;
