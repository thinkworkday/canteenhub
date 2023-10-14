import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import notAuthImg from '@src/assets/images/pages/not-authorized.svg';

import themeConfig from '@configs/themeConfig';

import '@styles/base/pages/page-misc.scss';

const NotAuthorized = () => (
  <div className="misc-wrapper">
    <a className="brand-logo" href="/">
      <img src={themeConfig.app.appLogoImage} alt="Canteen Hub" className="mb-2 " />
    </a>
    <div className="misc-inner p-2 p-sm-3">
      <div className="w-100 text-center">
        <h2 className="mb-1">Ooops, you do not have access to this page 🔐</h2>
        <p className="mb-2">
          Please contact Canteen Hub if you feel this is incorrect
        </p>
        <Button.Ripple tag={Link} to="/" color="primary" className="btn-sm-block mb-1">
          Back to Dashboard
        </Button.Ripple>
        <img className="img-fluid" src={notAuthImg} alt="Not authorized page" />
      </div>
    </div>
  </div>
);
export default NotAuthorized;
