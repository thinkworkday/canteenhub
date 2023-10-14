/* eslint-disable react/no-danger */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
// ** Configs
import themeConfig from '@configs/themeConfig';
import { getNewsletterView } from '@store/actions/newsletter.actions';

import Spinner from '@components/spinner/Loading-spinner';
import ribbonRight from '@src/assets/images/pages/ribbon-right.png';
import ribbonLeft from '@src/assets/images/pages/ribbon-left.png';
import subsForYouImg from '@src/assets/images/pages/subs-for-you-green.png';
import subwayImg from '@src/assets/images/pages/subway.png';
import gofoodzImg from '@src/assets/images/pages/gofoodz.png';

const NewsLetterView = () => {
  // ** Store Vars
  const dispatch = useDispatch();

  const newsletterView = useSelector((state) => state.newsletterView);

  useEffect(() => {
    dispatch(getNewsletterView());
  }, [dispatch]);

  return (
    <div className="container">
      <div className="w-100">
        <div className="d-flex justify-content-between align-items-center">
          <img src={ribbonRight} alt="Ribbon Right" className="newsletter-ribbon" />
          <div className="d-flex justify-content-between newsletter-img-group">
            <div className="">
              <Link to="/">
                <img src={themeConfig.app.appLogoImage} alt="logo" className="newsletter-logo" />
              </Link>
              <div className="mt-1">
                www.canteenhub.com.au
              </div>
            </div>
            <div className="newletter-visible">
              <img src={subsForYouImg} alt="logo" className="newsletter-logo" />
            </div>
            <div className="newletter-visible">
              <img src={subwayImg} alt="logo" className="newsletter-logo" />
            </div>
            <div className="newletter-visible">
              <img src={gofoodzImg} alt="logo" className="newsletter-logo" />
            </div>
          </div>
        </div>
      </div>
      <Row className="justify-content-center mt-3">
        <Col sm="12" md="6">
          {newsletterView.loading ? <div className="land-content"><Spinner /></div> : (
            <div dangerouslySetInnerHTML={{ __html: newsletterView.data.content }} />
          )}
        </Col>
      </Row>
      <div className="mt-1">
        <img src={ribbonLeft} alt="Ribbon Left" className="newsletter-ribbon newsletter-ribbon-right" />
      </div>
    </div>
  );
};

export default NewsLetterView;
