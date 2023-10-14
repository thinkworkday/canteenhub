/* eslint-disable react/jsx-no-undef */
import { useState, useEffect } from 'react';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';
import {
  getMenuItem, getMenu, updateMenu,
} from '@store/actions/menu.actions';

import { useForm, Controller } from 'react-hook-form';
import CurrencyInput from 'react-currency-input-field';

// ** Reactstrap
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Card, CardImg, CardBody, CardText, Row, Col, Input,
} from 'reactstrap';

// ** Utils
import { priceFormatter, priceFormatterNoCurrency } from '@utils';

// ** Components
import OptionsAccordion from '@src/components/menus/OptionsAccordion';

// ** Third Party Components
import { toast } from 'react-toastify';

const ModalEditItem = (props) => {
  const dispatch = useDispatch();

  // ** Props
  const {
    selectedItem, selectedMenu, currentCurrency, loggedUserRole,
  } = props;

  // ** Store
  const item = useSelector((state) => state.records.selectedRecord);

  // ** Form
  const {
    handleSubmit, control,
  } = useForm();

  // ** States
  const [menuItemModifications, setMenuItemModifications] = useState();

  // ** Get data on mount
  useEffect(() => {
    if (selectedItem && selectedItem !== '') {
      dispatch(getMenuItem(selectedItem));
      setMenuItemModifications(selectedMenu.menuItemModifications.find(((obj) => obj.itemId === selectedItem)));
    }
  }, [selectedItem]);

  // useEffect(() => {
  //   console.log('need to load on ');
  // }, [item]);

  const handleClose = async () => {
    props.modalToggle();
  };

  const onSubmit = async (data) => {
    const {
      newPriceAUD, currencyAUD, newPriceNZD, currencyNZD,
    } = data;
    const { menuItemModifications } = selectedMenu;
    const objIndex = menuItemModifications.findIndex(((obj) => obj.itemId === item._id));
    const newPrices = [
      { newPriceAUD: (newPriceAUD === null || newPriceAUD === '' ? '' : priceFormatterNoCurrency(newPriceAUD || 0)), currency: currencyAUD },
      { newPriceNZD: (newPriceNZD === null || newPriceNZD === '' ? '' : priceFormatterNoCurrency(newPriceNZD || 0)), currency: currencyNZD },
    ];

    if (objIndex > -1) {
      menuItemModifications[objIndex].newPrice = newPrices;
    } else {
      menuItemModifications.push({ itemId: item._id, newPrice: newPrices });
    }

    try {
      await dispatch(updateMenu(selectedMenu._id, { menuItemModifications }));
      await dispatch(getMenu(selectedMenu._id));
      toast.success('Menu Updated');
      handleClose();
      // setProcessing(false);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      // setProcessing(false);
    }
  };

  const getOneNewPrice = (newPriceList, currencyVal) => {
    const filtered = newPriceList.find((priceOne) => priceOne.currency === currencyVal);
    const filteredNewPrice = filtered ? filtered[`newPrice${currencyVal}`] : 0;
    return filteredNewPrice;
  };

  return (

    <Modal scrollable isOpen={props.modalVisibility} className=" modal-add-to-cart" toggle={() => props.modalToggle()}>

      <ModalHeader className="justify-content-center" toggle={() => props.modalToggle()}>{item?.name}</ModalHeader>

      <ModalBody className="p-0">
        <Form>
          <Card className="card-add-to-cart">
            <CardImg top src={item?.image} alt="Card cap" />
            <CardBody className="pt-0 pb-0">
              <CardText>
                {item?.description}
              </CardText>
              <hr />
              {item ? item.prices.map((price, index) => (
                // eslint-disable-next-line no-nested-ternary
                <Row key={index} className={loggedUserRole === 'admin' ? '' : price.currency !== currentCurrency ? 'd-none' : ''}>
                  <Col>
                    <FormGroup>
                      <Label className="form-label" for={`newPrice${price.currency}`}>
                        Orig. Price (
                        {price.currency}
                        )
                      </Label>
                      <div className="mt-75">
                        {priceFormatter(price.amount)}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label className="form-label" for={`newPrice${price.currency}`}>
                        New Price
                      </Label>
                      <Controller
                        as={CurrencyInput}
                        placeholder="0.00"
                        type="text"
                        defaultValue={menuItemModifications ? getOneNewPrice(menuItemModifications.newPrice, price.currency) : ''}
                        id={`newPrice${price.currency}`}
                        name={`newPrice${price.currency}`}
                        decimalsLimit={2}
                        control={control}
                        className="form-control"
                      />
                      <Controller
                        control={control}
                        id={`currency${price.currency}`}
                        name={`currency${price.currency}`}
                        defaultValue={price.currency}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="hidden"
                            className="form-control"
                          />
                        )}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              )) : ''}

              {item?.options ? <OptionsAccordion selectedMenu={selectedMenu} selectedMenuItem={item} allowDelete={false} /> : ''}

            </CardBody>
          </Card>
        </Form>
      </ModalBody>

      <ModalFooter className="justify-content-center shadow">
        <Button.Ripple color="primary" onClick={handleSubmit(onSubmit)}>
          Save
        </Button.Ripple>
        <Button.Ripple outline color="flat-secondary" onClick={() => handleClose()}>
          Cancel
        </Button.Ripple>
      </ModalFooter>
    </Modal>

  );
};

export default ModalEditItem;
