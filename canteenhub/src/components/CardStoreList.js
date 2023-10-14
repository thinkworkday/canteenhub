/* eslint-disable global-require */
import Avatar from '@components/avatar';
import { Image } from 'react-feather';
import {
  Card, CardHeader, CardTitle, CardBody, Media,
} from 'reactstrap';

const CardStoreList = (props) => {
  const stores = props.storeData.data;
  const renderStores = () => stores.map((store) => (
    <div key={store._id} className="store-row d-flex justify-content-between align-items-center">
      <Media>
        {
        store.storeLogo ? <img className=" img-fluid" src={store.storeLogo} alt={store.storeName} /> : <Avatar color="light-secondary" icon={<Image size={24} />} className="no-image" />
        }
        <Media className="my-auto" body>
          <h6 className="mb-0">{store.storeName}</h6>
          <small className="text-muted">{store.storeEmail}</small>
        </Media>
      </Media>
      {/* <div className="d-flex align-items-center">
        <small className="text-muted mr-75">{store.storeName}</small>
      </div> */}
    </div>
  ));

  return (
    <Card className="card-store-list">
      <CardHeader>
        <CardTitle tag="h5">My Stores</CardTitle>
        {/* <MoreVertical size={18} className="cursor-pointer" /> */}
      </CardHeader>
      <CardBody>{renderStores()}</CardBody>
    </Card>
  );
};

export default CardStoreList;
