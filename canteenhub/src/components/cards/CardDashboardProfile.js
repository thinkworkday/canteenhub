// ** React Imports
// import { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';
// import { getProfiles } from '@store/actions/customer.actions';
import { getLoggedUser } from '@utils';

// ** 3rd party components
import Avatar from '@components/avatar';
import CustomerHeroImage from '@src/assets/images/illustrations/customerHero';
import SchoolHeroImage from '@src/assets/images/illustrations/schoolHero';
import {
  Card, CardBody, Badge, Button,
} from 'reactstrap';
// import profileImg from '@src/assets/images/portrait/small/avatar-s-9.jpg';
import CardHeader from 'reactstrap/lib/CardHeader';

const CardProfile = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.records);

  const loggedUser = getLoggedUser();
  const fullName = `${loggedUser.firstName} ${loggedUser.lastName}`;

  // console.log('loggedUser', loggedUser);

  // ** Get data on mount
  // useEffect(() => {
  //   dispatch(getProfiles());
  // }, [dispatch, store.data.length]);
  return (
    <Card className="card-profile profile-customer">
      {/* <CardImg className="img-fluid" src={coverImg} top /> */}
      <CardHeader className="justify-content-end">
        {loggedUser.role === 'customer' ? <CustomerHeroImage /> : ''}
        {loggedUser.role === 'group' ? <SchoolHeroImage /> : ''}

      </CardHeader>
      <CardBody>
        <div className="profile-image-wrapper">
          <div className="profile-image">
            <Avatar size="xl" color="success" content={fullName} initials />
          </div>
        </div>
        <h3>
          Hi
          {' '}
          {loggedUser.firstName}
        </h3>
        <h6 className="text-muted">{loggedUser.role === 'groups' ? 'school' : loggedUser.role}</h6>
        <Badge className="profile-badge" color="light-primary">
          {loggedUser.status}
        </Badge>
        <Button.Ripple tag={Link} to="/customer/order/checkout" color="aero" className="d-lg-none">
          Order Now!
        </Button.Ripple>
        {/* <hr className="mb-2" />
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <small className="text-muted ">
              Total Orders
            </small>
            <h3 className="mb-0">2</h3>
          </div>
          <div>
            <small className="text-muted">
              Upcoming
              Orders
            </small>
            <h3 className="mb-0">2</h3>
          </div>
          <div>
            <small className="text-muted ">
              Profiles
            </small>
            <h3 className="mb-0">2</h3>
          </div>
        </div> */}
      </CardBody>
    </Card>
  );
};

export default CardProfile;
