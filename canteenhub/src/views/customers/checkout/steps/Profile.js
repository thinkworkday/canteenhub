// ** React Imports
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// ** Store & Actions
import { addCartOrder, updateCartOrder } from '@store/actions/cart.actions';
import { getProfiles } from '@store/actions/customer.actions';

// ** Third Party Components
import Avatar from '@components/avatar';
import classnames from 'classnames';
import { useForm } from 'react-hook-form';
import {
  ArrowRight, Plus, CheckCircle,
} from 'react-feather';
import {
  Alert, Form, Row, Col, Button, Media,
} from 'reactstrap';

// ** Utils
import { getInitials } from '@utils';

// ** Custom Components
import AddProfileSidebar from '@src/views/customers/profiles/AddProfileSidebar';

const AccountDetails = ({
  stepper, loggedUser, currentOrder, isNewOrder,
}) => {
  const dispatch = useDispatch();
  const myProfiles = useSelector((state) => state.profiles.data);
  const selectedProfile = useSelector((state) => state.profiles.selectedProfile);

  const [profileSelected, setProfileSelected] = useState(null);
  const [step1Errors, setStep1Errors] = useState([]);

  // ** AddEventSidebar Toggle Function
  const [addSidebarOpen, setAddSidebarOpen] = useState(false);
  const handleAddProfileSidebar = () => setAddSidebarOpen(!addSidebarOpen);

  // ** Step change listener on mount
  useEffect(() => {
    dispatch(getProfiles());
    if (currentOrder) {
      setProfileSelected(!isNewOrder && currentOrder ? currentOrder.profile[0]._id : null);
    }
  }, [loggedUser, currentOrder, isNewOrder]);

  const handleProfileSelect = (profile, i, disabledClass) => {
    if (!disabledClass) {
      setProfileSelected(profile._id);
    }
  };

  // const handleInitEdit = async (row) => {
  //   await dispatch(getProfile(row._id));
  //   handleAddProfileSidebar();
  // };

  const {
    handleSubmit,
  } = useForm();

  const onSubmit = async () => {
    if (!profileSelected) {
      await setStep1Errors([{ error: 'no profile selected' }]);
    } else {
      const orderData = {
        customer: loggedUser._id,
        profile: [profileSelected],
      };

      // Create or Update Order (if Continueing)
      try {
        if (!currentOrder) {
          await dispatch(addCartOrder(orderData));
        } else {
          await dispatch(updateCartOrder(currentOrder._id, { profile: [profileSelected], currentStep: 2 }));
        }

        stepper.next();
        // setProcessing(false);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('ERROR', err);
        // setApiErrors(err.response ? err.response : { data: err.response.data });
      }
    }
  };

  const renderProfiles = () => {
    const profileOptions = myProfiles.map((profile, i) => {
      const fullName = `${profile.firstName} ${profile.lastName}`;
      const initals = getInitials(fullName);
      const group = profile.subgroups[0] && profile.subgroups[0].group ? profile.subgroups[0].group.companyName : '';
      const subgroup = profile.subgroups[0] ? profile.subgroups[0].name : '';

      const activeClass = (profileSelected && profileSelected === profile._id) ? 'active' : '';
      const disabledClass = (!group) ? 'disabled' : '';

      return (
        <div role="button" tabIndex={i} key={`${profile.firstName}-${i}`} className={classnames('btn-card', 'mr-1', 'd-flex', 'justify-content-md-between', 'align-items-center', activeClass, disabledClass)} onClick={() => handleProfileSelect(profile, i, disabledClass)} onKeyDown={() => handleProfileSelect(profile, i, disabledClass)}>
          <Media className="align-items-center">
            <Avatar color="light-secondary" size="lg" content={initals} className="mr-1 bg-success" />
            <Media body>
              <h6 className="transaction-title mb-0">{`${profile.firstName} ${profile.lastName}`}</h6>
              <small>
                {group || <span className="d-block text-danger">No school. Please assign before ordering</span>}
                {' '}
                {subgroup}
              </small>
              {/* Removed as it was not working on iOS - will need to move outside of onclick event */}
              {/* <Button.Ripple
                size="xs"
                color="flat-danger btn-edit"
                onClick={(e) => {
                  e.preventDefault();
                  handleInitEdit(profile);
                  // handleAddProfileSidebar();
                }}
              >
                <Edit size={15} />
              </Button.Ripple> */}
            </Media>
          </Media>
          <CheckCircle size={36} className="check-notificaiton d-none" />
        </div>

      );
    });
    return profileOptions;
  };

  return (
    <>
      <div className="content-header mb-3">
        <h3 className="mb-0">
          Hi
          {' '}
          {loggedUser.firstName}
          , who will you be ordering for today?
        </h3>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {step1Errors.length > 0 ? (
          <Alert color="primary">
            <div className="alert-body">
              <span>You must select a profile to continue</span>
            </div>
          </Alert>
        ) : <></>}

        <Row>
          <Col md="11">
            <div className="d-flex flex-wrap">
              {renderProfiles()}
            </div>
            <div className="mt-2 mb-5">
              <Button.Ripple size="sm" color="flat-dark" onClick={() => handleAddProfileSidebar()}>
                <Plus size={15} />
                Create new profile
              </Button.Ripple>
            </div>
          </Col>
        </Row>
        <div className="action-wrapper d-flex justify-content-center">
          <Button.Ripple type="submit" color="primary" className="btn-next">
            <span className="align-middle ">
              Continue
            </span>
            <ArrowRight size={14} className="align-middle ml-sm-25 ml-0" />
          </Button.Ripple>
        </div>
      </Form>

      <AddProfileSidebar
        store={myProfiles}
        selectedProfile={selectedProfile}
        dispatch={dispatch}
        open={addSidebarOpen}
        handleAddProfileSidebar={handleAddProfileSidebar}
      />
    </>
  );
};

export default AccountDetails;
