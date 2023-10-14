/* eslint-disable global-require */
import {
  Card, CardHeader, CardTitle, CardBody, Media,
} from 'reactstrap';

import { DisplayStatus } from '@src/components/DisplayStatus';
import { formatDate, getInviteStatus } from '@src/utility/Utils';

const CardInviteList = (props) => {
  const invites = props.inviteData?.data;
  const renderInvites = () => invites.map((invite) => (
    <div key={invite._id} className="store-row d-flex justify-content-between align-items-start">
      <Media>
        {/* <img className=" img-fluid" src={store.storeLogo} alt={store.storeName} /> */}
        <Media className="my-auto" body>
          <h6 className="mb-25">{invite.toCompanyName}</h6>
          <small className="text-muted d-block">
            {invite.toEmail}
          </small>
          <small className="text-muted">
            Sent:
            {' '}
            {formatDate(invite.createdAt)}
          </small>
        </Media>
      </Media>
      <div className="d-flex align-items-center">
        <DisplayStatus status={getInviteStatus(invite)} />
      </div>
    </div>
  ));

  return (
    <Card className="card-store-list">
      <CardHeader>
        <CardTitle tag="h6">Active Invites</CardTitle>
        {/* <MoreVertical size={18} className="cursor-pointer" /> */}
      </CardHeader>
      <CardBody>{renderInvites()}</CardBody>
    </Card>
  );
};

export default CardInviteList;
