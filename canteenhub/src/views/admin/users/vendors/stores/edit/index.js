/* eslint-disable radix */
// ** React Imports
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// ** Axios
import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux';

// ** Reactstrap
import {
  Button, Row, Col, Alert,
} from 'reactstrap';

import { getStore } from '@store/actions/vendor.actions';

// ** User View Components
import StoreForm from './Store';
// import UserInfoCard from './UserInfoCard';
// import UserTimeline from './UserTimeline';
// import InvoiceList from '../../invoice/list';
// import PermissionsTable from './PermissionsTable';

// ** Styles
import '@styles/react/apps/app-users.scss';

const StoreView = (props) => {
  // ** Vars
  const selectedStore = useSelector((state) => state.stores.selectedStore);
  const dispatch = useDispatch();
  const { id, stripeStatus } = useParams();

  // const [user, setUser] = useState({});

  // const allState = useSelector((state) => state);

  // console.log('id', id);
  // console.log('selectedStore', selectedStore);

  // ** Get data on mount
  useEffect(() => {
    // console.log('getStore');
    dispatch(getStore(id));

    if (stripeStatus === 'checkConnectedAccount') {
      try {
        axios(`${process.env.REACT_APP_SERVER_URL}/api/stores/stripe/connectedAccount/checkStatus/${id}`, {
          method: 'GET',
          headers,
        })
          .try((response) => {
            console.log(response);
          })
          .catch((error) => {
          // eslint-disable-next-line no-console
            console.log(error);
          });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        // setApiErrors(err.response ? err.response : { data: err.response.data });
      }
    }
  }, [dispatch, selectedStore?.stripeAccountStatus]);

  return selectedStore !== null && selectedStore !== undefined ? (
    <div className="app-user-view">
      <div className="table-header">
        <Button.Ripple color="flat-light" onClick={() => window.history.back()}>
          &lt; back to list
        </Button.Ripple>
        <h3>
          Edit Store
        </h3>
      </div>

      <Row>
        <Col>
          <StoreForm selectedStore={selectedStore[0]} />
        </Col>
      </Row>
    </div>
  ) : (
    <Alert color="danger">
      <h4 className="alert-heading">Store not found</h4>
      <div className="alert-body">
        {`Store with id: ${id} does not exist `}
        <Link to="/stores">Back to Stores List</Link>
      </div>
    </Alert>
  );
};
export default StoreView;
