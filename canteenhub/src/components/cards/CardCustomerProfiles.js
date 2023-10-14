import { useState } from 'react';
import { Link } from 'react-router-dom';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '@store/actions/customer.actions';

// import Chart from 'react-apexcharts';
import Avatar from '@components/avatar';
// import { MoreVertical } from 'react-feather';
import {
  Card, CardHeader, CardTitle, CardBody, CardFooter, Media, Button,
} from 'reactstrap';

// ** Custom Components
import AddProfileSidebar from '@src/views/customers/profiles/AddProfileSidebar';

const CardCustomerProfiles = ({
  data, editable = true, cta = true, dashboardCard = true,
}) => {
  // const data = '';
  if (!data || !data.length) {
    return false;
  }

  const dispatch = useDispatch();
  const selectedProfile = useSelector((state) => state.profiles.selectedProfile);
  const [addSidebarOpen, setAddSidebarOpen] = useState(false);

  // ** AddEventSidebar Toggle Function
  const handleAddProfileSidebar = () => setAddSidebarOpen(!addSidebarOpen);

  const handleInitEdit = async (row) => {
    await dispatch(getProfile(row._id));
    handleAddProfileSidebar();
  };

  // ** AddEventSidebar Toggle Function
  // const [addSidebarOpen, setAddSidebarOpen] = useState(false);
  // const handleAddProfileSidebar = () => setAddSidebarOpen(!addSidebarOpen);

  const renderProfiles = (editable) => data.map((profile) => (
    <div key={profile._id} className="card-row d-flex justify-content-between align-items-center ">
      <Media>
        <Avatar color="success" content={`${profile.firstName} ${profile.lastName}`} initials className="mr-75" />
        <Media className="my-auto" body>
          <h6 className="mb-0">{`${profile.firstName} ${profile.lastName}`}</h6>
          <small>
            {profile.subgroups[0] && profile.subgroups[0].group ? `${profile.subgroups[0].group.companyName} (${profile.subgroups[0].name})` : (
              <span className="text-info">No school. Please assign.</span>
            ) }
          </small>
        </Media>
      </Media>
      <div className="d-flex align-items-center">
        {editable ? <Button.Ripple onClick={() => handleInitEdit(profile)} size="xs" color="flat-primary" className="row-cta-edit d-none">edit &gt;</Button.Ripple> : ''}
      </div>
    </div>
  ));

  return (
    <>
      <Card className="card-employee-task">
        <CardHeader>
          {dashboardCard ? <CardTitle tag="h4">Profiles</CardTitle> : <p className="mb-0">Profiles</p>}
        </CardHeader>
        <CardBody>{renderProfiles(editable)}</CardBody>
        {cta ? (
          <CardFooter className="border-0 pt-0">
            <Button.Ripple tag={Link} to="/customer/profiles" size="xs" color="secondary" outline>
              View All &gt;
            </Button.Ripple>
          </CardFooter>
        ) : ''}
      </Card>
      <AddProfileSidebar
        selectedProfile={selectedProfile}
        dispatch={dispatch}
        open={addSidebarOpen}
        handleAddProfileSidebar={handleAddProfileSidebar}
      />
    </>
  );
};

export default CardCustomerProfiles;
