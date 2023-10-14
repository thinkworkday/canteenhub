import { useEffect } from 'react';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';
import { getGroup } from '@store/actions/group.actions';

import {
  Card, CardHeader, CardTitle, CardBody,
} from 'reactstrap';
// import CardFooter from 'reactstrap/lib/CardFooter';

const CardGroupSuppliers = ({ groupId }) => {
  const dispatch = useDispatch();
  const selectedGroup = useSelector((state) => state.groups.selectedGroup);

  // console.log('vendors', selectedGroup ? selectedGroup[0].vendors : '');

  // ** Get data on mount
  useEffect(() => {
    dispatch(getGroup(groupId));
    // const config = {
    //   method: 'get',
    //   url: `${process.env.REACT_APP_SERVER_URL}/api/groups/vendors/list`,
    //   headers: {
    //     Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWJiMWIyMTkwZDNjNTU0M2JmNDhkY2YiLCJpYXQiOjE2NDkyNDkwOTMsImV4cCI6MTY0OTMzNTQ5M30.YUHZb7DMXZEt5rmFh3MjlTf_UqC912gk9nW5rJORpkQ',
    //   },
    // };

    // axios(config)
    //   .then((response) => {
    //     setVendors(response.data.results);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }, []);

  const renderVendors = () => selectedGroup[0].vendors.map((vendor, i) => (
    <div key={vendor._id} className="card-row  ">
      {/* <Media> */}
      <h6 className="mb-0">{`${vendor.companyName}`}</h6>
      <small className="d-block">
        {vendor.email ? `${vendor.email} ` : '' }
      </small>
    </div>
  ));

  return (
    <Card className="card-employee-task">
      <CardHeader>
        <CardTitle tag="h4">Suppliers</CardTitle>
      </CardHeader>
      <CardBody>{selectedGroup && selectedGroup[0].vendors.length > 0 ? renderVendors() : 'No suppliers assigned to your school'}</CardBody>
    </Card>
  );
};

export default CardGroupSuppliers;
