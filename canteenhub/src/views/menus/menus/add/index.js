/* eslint-disable radix */
// ** React Imports
import { useParams } from 'react-router-dom';

// ** Utils
import { getLoggedUser } from '@utils';

// ** Reactstrap
import {
  Button, Row, Col,
} from 'reactstrap';

// ** User View Components
import AddMenuForm from './AddMenuForm';
import AddMenuVariationForm from './AddMenuVariationForm';

// ** Styles
import '@styles/react/apps/app-users.scss';

const StoreView = () => {
  const { mode } = useParams();
  const loggedUser = getLoggedUser();
  return (
    <div className="app-user-view">

      <div className="table-header">
        <Button.Ripple color="flat-light" onClick={() => window.history.back()}>
          &lt; back to list
        </Button.Ripple>
        <h3>
          {loggedUser.role === 'admin' ? 'Create New Menu' : 'Create Menu Variation'}

        </h3>
      </div>
      <Row>
        <Col>
          {loggedUser.role === 'admin' ? <AddMenuForm mode={mode} /> : <AddMenuVariationForm />}
        </Col>
      </Row>
    </div>
  );
};
export default StoreView;
