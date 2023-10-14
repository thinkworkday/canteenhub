// ** React Imports
import { useRef, useState, useEffect } from 'react';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';
import { getCartOrder, getCartOrders } from '@store/actions/cart.actions';

// ** Utils
import { getLoggedUser } from '@utils';

// ** 3rd Party Components
import Wizard from './WizardCheckout';
import ModalContinueOrder from './ModalContinueOrder';

// ** Step Components
import Profile from './steps/Profile';
import OrderDate from './steps/OrderDate';
import BuildOrder from './steps/BuildOrder';
import Payment from './steps/Payment';

const WizardHorizontal = () => {
  // ** Vars
  const dispatch = useDispatch();
  const cartOrders = useSelector((state) => state.cart);
  const currentOrder = useSelector((state) => state.cart.selectedOrder);
  const [isLoading, setIsLoading] = useState(true);
  const [currency, setCurrency] = useState('');

  const [modalContinueVisibility, setModalContinueVisibility] = useState(false);
  const toggleContinueModal = () => { setModalContinueVisibility(!modalContinueVisibility); };
  const [isNewOrder, setIsNewOrder] = useState(false);

  const [stepper, setStepper] = useState(null);
  const ref = useRef(null);

  const loggedUser = getLoggedUser();

  useEffect(() => {
    const getCurrency = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const currencyData = await response.json();
          setCurrency(currencyData.currency === 'AUD' || currencyData.currency === 'NZD' ? currencyData.currency : 'AUD');
        } else {
          throw new Error('Request failed');
        }
      } catch (error) {
        console.log(error);
      }
    };

    getCurrency();
  }, []);

  // Load Last Order in cartOrders (if present)
  useEffect(() => {
    dispatch(getCartOrders({ created: 60 })); // created in past 60 minutes
    setTimeout(async () => {
      if (cartOrders && cartOrders.data.length > 0) {
        dispatch(getCartOrder(cartOrders.data[0]._id)); // use the latest cart order
        if (currentOrder) {
          setModalContinueVisibility(true);
        }
      } else {
        await dispatch({
          type: 'GET_CART_ORDER',
          selectedOrder: null,
        });
      }
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, [dispatch, cartOrders.data.length]);

  const steps = [
    {
      id: 'profile-details',
      title: 'Profiles',
      subtitle: 'Select the profile for the order',
      content: <Profile stepper={stepper} type="wizard-horizontal" loggedUser={loggedUser} currentOrder={currentOrder} isNewOrder={isNewOrder} />,
    },
    {
      id: 'order-date',
      title: 'Order Date',
      subtitle: 'Select the order event / date',
      content: <OrderDate stepper={stepper} type="wizard-horizontal" loggedUser={loggedUser} currentOrder={currentOrder} isNewOrder={isNewOrder} />,
    },
    {
      id: 'build-order',
      title: 'Order',
      subtitle: 'Build your order',
      content: <BuildOrder stepper={stepper} type="wizard-horizontal" loggedUser={loggedUser} currentOrder={currentOrder} isNewOrder={isNewOrder} currentCurrency={currency} />,
    },
    {
      id: 'payment-details',
      title: 'Payment',
      subtitle: 'Enter your payment details',
      content: <Payment stepper={stepper} type="wizard-horizontal" loggedUser={loggedUser} currentOrder={currentOrder} isNewOrder={isNewOrder} currentCurrency={currency} />,
    },
  ];

  return (
    <>
      <div className="checkout-wizard">
        {isLoading ? '' : <Wizard instance={(el) => setStepper(el)} ref={ref} steps={steps} currentOrder={currentOrder} isLoading={isLoading} setIsNewOrder={setIsNewOrder} />}
      </div>
      <ModalContinueOrder modalVisibility={modalContinueVisibility} modalToggle={() => toggleContinueModal()} currentOrder={currentOrder} />
    </>
  );
};

export default WizardHorizontal;
