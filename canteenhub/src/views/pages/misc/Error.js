import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import errorImg from '@src/assets/images/pages/error-api.svg';

import themeConfig from '@configs/themeConfig';

import '@styles/base/pages/page-misc.scss';

const Error = () => (
  <div className="misc-wrapper">
    <a className="brand-logo" href="/">
      <img src={themeConfig.app.appLogoImage} alt="Canteen Hub" className="mb-2 " />
    </a>
    <div className="misc-inner p-2 p-sm-3">
      <div className="w-100 text-center">
        <h2 className="mb-1">Connection Issue</h2>
        <p className="mb-2">Oops! 😖 We are currently experiencing connection issues. Please contact us if errors persist.</p>
        <Button.Ripple tag={Link} to="/" color="primary" className="btn-sm-block mb-2">
          Back to home
        </Button.Ripple>
        <img className="img-fluid" src={errorImg} alt="Not authorized page" />
      </div>
    </div>
  </div>
);
export default Error;
