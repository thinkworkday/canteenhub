import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import deployImg from '@src/assets/images/pages/deploy.svg';

import themeConfig from '@configs/themeConfig';

import '@styles/base/pages/page-misc.scss';

const Error503 = () => (
  <div className="misc-wrapper">
    <a className="brand-logo" href="/">
      <img src={themeConfig.app.appLogoImage} alt="Canteen Hub" className="mb-2 " />
    </a>
    <div className="misc-inner p-2 p-sm-3">
      <div className="w-100 text-center">
        <h2 className="mb-1">Back online soon</h2>
        <p className="mb-2">We are temporarily undertaking system maintenance and will be back taking orders very soon. Thanks for understanding.</p>
        <Button.Ripple tag={Link} to="/" color="primary" className="btn-sm-block mb-2">
          Back to home
        </Button.Ripple>
        <div className="py-4">
          <img className="img-fluid" style={{ maxHeight: '300px' }} src={deployImg} alt="Back online soon page" />
        </div>
      </div>
    </div>
  </div>
);
export default Error503;
