/* eslint-disable jsx-a11y/interactive-supports-focus */
// ** React Imports
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// ** Actions
import { getCartOrder, updateCartOrder } from '@store/actions/cart.actions';
import { getMenu } from '@store/actions/menu.actions';

// ** Third Party Components
import { useForm } from 'react-hook-form';

import {
  ArrowLeft, ArrowRight, ShoppingBag,
} from 'react-feather';
import {
  Alert, Form, FormGroup, Row, Col, Card, CardBody, Button, Nav, NavItem, NavLink, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';

// ** Utils
import { calculateOrderTotals, priceFormatter } from '@utils';

// ** Components
import Cart from '@src/components/Cart';
import CardItemButton from '@src/components/cards/CardItemButton';
import ModalAddToCart from './ModalAddToCart';
import ModalCartValidation from './ModalCartValidation';

const BuildOrder = ({ stepper, isNewOrder, currentCurrency }) => {
  const dispatch = useDispatch();
  const menu = useSelector((state) => state.menus.selectedMenu);
  const currentOrder = useSelector((state) => state.cart.selectedOrder); // current order
  const profiles = useSelector((state) => state.profiles.data);

  const [step3Errors, setStep3Errors] = useState([]);

  const [selectedItem, setSelectedItem] = useState(); // sets when user clicks an item
  const [activeCat, setActiveCat] = useState(1); // sets when user clicks an item
  const [showCart, setShowCart] = useState(false); // sets when user clicks an item
  // const [itemsSelected, setItemsSelected] = useState([]); // sets for items added to cart
  const [backDisabled, setBackDisabled] = useState(false);

  const [basicModal, setBasicModal] = useState(false);

  const [modalAddItemVisibility, setModalAddItemVisibility] = useState(false);
  const toggleAddItemModal = () => {
    setModalAddItemVisibility(!modalAddItemVisibility);
  };

  const [modalVisibilityCartValid, setModalVisibilityCartValid] = useState(false);
  const toggleCartValidModal = () => {
    setModalVisibilityCartValid(!modalVisibilityCartValid);
  };

  // eslint-disable-next-line no-unused-vars
  const [ans, setAns] = useState();

  const getCalculatedTotals = async () => {
    const orderTotals = await calculateOrderTotals(currentOrder);
    await dispatch(updateCartOrder(currentOrder._id, { orderTotals }));
    await dispatch(getCartOrder(currentOrder._id));
    setAns(orderTotals);
  };

  // ** Get the correct Menu
  useEffect(() => {
    if (currentOrder && currentOrder.currentMenu && currentOrder.currentMenu._id) {
      dispatch(getMenu(currentOrder.currentMenu._id));
    }
  }, [currentOrder]);

  useEffect(() => {
    if (isNewOrder) setBackDisabled(false);
  }, [isNewOrder]);

  // ** Get the totals
  useEffect(() => {
    if (stepper && stepper._currentIndex === 2) {
      getCalculatedTotals();
    }
  }, [stepper?._currentIndex]);

  const {
    handleSubmit,
  } = useForm();

  const handleContinueCheckout = async () => {
    await dispatch(updateCartOrder(currentOrder._id, { currentStep: 4 }));
    stepper.next();
    setBasicModal(false);
  };

  const onSubmit = async () => {
    if (currentOrder.orderLines.length <= 0) {
      await setStep3Errors([{ error: 'Your cart is empty. Please add items to continue to payment' }]);
    } else {
      const orderableProfiles = profiles.filter((p) => !currentOrder.profile.map((e) => e._id).includes(p._id));

      if (orderableProfiles.length > 0) {
        setBasicModal(true);
      } else {
        handleContinueCheckout();
      }
    }
  };

  const handleAddNewOrder = () => {
    stepper.reset();
    stepper.destroy();
    setBasicModal(false);
  };

  const handlePreviousClick = async () => {
    await dispatch(updateCartOrder(currentOrder._id, { currentStep: 2 }));
    // await setStep3Errors([]);
    stepper.previous();
  };

  const handleCategoryClick = async (i) => {
    document.getElementById(`catTab-${i}`).scrollIntoView({ behavior: 'smooth' });
    await setStep3Errors([]);
    setActiveCat(i);
  };

  const handleMenuItemClick = async (item) => {
    setSelectedItem(item);
    await setStep3Errors([]);
    toggleAddItemModal();
  };

  const renderCategoryTabs = () => {
    if (!menu) { return null; }
    const catTabs = menu.menuData.map((menuCat, i) => (
      <NavItem key={`catTab-${i}`} onClick={() => handleCategoryClick(i)}>
        {activeCat === i ? <NavLink active>{menuCat.catName}</NavLink> : <NavLink>{menuCat.catName}</NavLink> }
      </NavItem>
    ));
    return (
      <Nav pills className="nav-pill-light nav-pill-sm my-2 mb-3">
        {catTabs}
      </Nav>
    );
  };

  const renderMenuItems = () => {
    if (!menu) { return null; }

    const menuItems = menu.menuData.map((menuCat, i) => (
      <div key={`cat-${i}`} className="checkout-menu-cat-wrapper d-block">

        { menuCat.items ? (
          <div id={`catTab-${i}`}>
            <h4 className="pt-3 pb-1">{menuCat.catName}</h4>
            <Row className="items-wrapper justify-content-start">
              {menuCat.items.map((item, i2) => (
                <Col className="mb-1 col-12 col-sm-6 col-md-6 col-lg-12 col-xl-6" key={`item-${i2}`}>
                  <CardItemButton
                    item={item}
                    menu={menu}
                    index={i2}
                    handleMenuItemClick={handleMenuItemClick}
                    isCustomerFacing
                    currentOrder={currentOrder}
                    currentCurrency={currentCurrency}
                  />
                </Col>
              )) }
            </Row>
          </div>
        ) : <></>}

        <hr />
      </div>
    ));

    return menuItems;
  };

  return (
    <>
      <div className="content-header mb-3">
        <small className="text-muted d-block">Menu</small>
        <h2>{menu ? menu.name : ''}</h2>
        {menu && menu.description ? <p className="mt-1">{menu.description}</p> : ''}
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {step3Errors.length > 0 ? (
          <Alert color="primary">
            <div className="alert-body">
              <span>{step3Errors[0].error}</span>
            </div>
          </Alert>
        ) : <></>}
        {renderCategoryTabs()}
        <Row>
          <Col>
            {renderMenuItems()}
          </Col>
        </Row>
        <div className="action-wrapper d-flex justify-content-center mt-3">
          <Button.Ripple color="primary" outline className="btn-prev mr-1" disabled={backDisabled} onClick={() => handlePreviousClick()}>
            <ArrowLeft size={14} className="align-middle mr-sm-25 mr-0" />
            <span className="align-middle d-none d-md-inline-block">Back</span>
          </Button.Ripple>
          <Button.Ripple color="primary" outline className="btn-prev mr-1 d-lg-none" onClick={() => (showCart ? setShowCart(false) : setShowCart(true))}>
            <ShoppingBag size={18} className="align-middle mr-sm-25 mr-0" />
          </Button.Ripple>
          <Button.Ripple type="submit" color="primary" className="btn-next">
            <span className="align-middle">
              Checkout
              {' '}
              {currentOrder && currentOrder.orderTotals && currentOrder.orderTotals[0] && currentOrder.orderTotals[0].orderTotal > 0 ? priceFormatter(currentOrder.orderTotals[0].orderTotal) : ''}
            </span>
            <ArrowRight size={14} className="align-middle ml-sm-25 ml-0" />
          </Button.Ripple>
        </div>
      </Form>
      <Cart showCart={showCart} setShowCart={setShowCart} currentOrder={currentOrder} />

      {/* Modals */}
      <ModalAddToCart modalVisibility={modalAddItemVisibility} setBackDisabled={setBackDisabled} modalToggle={() => toggleAddItemModal()} currentOrder={currentOrder} currentCurrency={currentCurrency} selectedItem={selectedItem} menu={menu} modalValidToggle={() => toggleCartValidModal()} />

      <ModalCartValidation modalVisibility={modalVisibilityCartValid} modalToggle={() => toggleCartValidModal()} />

      <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)} className="modal-dialog-centered">
        <ModalHeader>
          Checkout or order for another profile?
        </ModalHeader>
        <ModalBody className="p-0">
          <Row>
            <Col sm="12">
              <Card className="mb-0">
                <CardBody>
                  <Row>
                    <Col sm="12">
                      <p>
                        We noticed you have multiple profiles in your account.
                        <br />
                        You can add additional profiles to a single order to avoid multiple transactions.
                      </p>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter className="justify-content-start">
          <Row>
            <Col sm="12">
              <FormGroup className="d-flex mt-1">
                <Button.Ripple color="primary" onClick={handleContinueCheckout}>
                  Checkout now
                </Button.Ripple>
                <Button.Ripple outline className="ml-1 d-flex" color="primary" onClick={handleAddNewOrder}>
                  <span>Add another profile</span>
                </Button.Ripple>
              </FormGroup>
            </Col>
          </Row>
        </ModalFooter>
      </Modal>

    </>
  );
};

export default BuildOrder;
