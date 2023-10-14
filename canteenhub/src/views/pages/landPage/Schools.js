/* eslint-disable react/jsx-key */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Card, CardBody, CardDeck, CardFooter, CardText, Col, Row,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

import backgroundImg from '@src/assets/images/pages/background.png';
import subsForYouImg from '@src/assets/images/pages/subs-for-you-green.png';
import {
  ArrowRight,
} from 'react-feather';
import {
  getMarketSiteSchools, getMarketSiteSchoolContent, getMarketSiteProvides, getMarketSiteWork, getMarketSitePartners, getMarketSiteFeedbacks,
} from '@store/actions/market.actions';
import Spinner from '@components/spinner/Loading-spinner';
import ModalQuestion from '../../../components/modals/ModalQuestion';

const SchoolPage = () => {
  // ** Store Vars
  const dispatch = useDispatch();

  const marketSiteSchools = useSelector((state) => state.marketSiteSchools);
  const marketSiteSchoolContent = useSelector((state) => state.marketSiteSchoolContent);
  const marketSiteProvides = useSelector((state) => state.marketSiteProvides);
  const marketSiteWorks = useSelector((state) => state.marketSiteWorks);
  const marketSitePartners = useSelector((state) => state.marketSitePartners);
  const marketSiteFeedbacks = useSelector((state) => state.marketSiteFeedbacks);
  const [pageType, setPageType] = useState('schools');

  const [modalQuestionVisibility, setModalQuestionVisibility] = useState(false);
  const toggleQuestionModal = () => {
    setModalQuestionVisibility(!modalQuestionVisibility);
  };

  // Set dispatch construct
  const dispatchParams = {
    pageType,
  };
  useEffect(() => {
    dispatch(getMarketSiteSchoolContent(dispatchParams));
  }, [dispatch]);
  useEffect(() => {
    dispatch(getMarketSiteSchools());
    dispatch(getMarketSiteProvides());
  }, [dispatch, marketSiteSchools.data.length]);
  useEffect(() => {
    dispatch(getMarketSitePartners());
  }, [marketSitePartners.data.length]);
  useEffect(() => {
    dispatch(getMarketSiteWork());
  }, [marketSiteWorks.data.length]);
  useEffect(() => {
    dispatch(getMarketSiteFeedbacks());
  }, [marketSiteFeedbacks.data.length]);

  const params = {
    className: 'swiper-centered-slides swiper-container py-3 px-2',
    slidesPerView: 'auto',
    watchSlidesProgress: true,
    spaceBetween: 20,
    centeredSlides: false,
    navigation: false,
    slideToClickedSlide: true,
    effect: 'coverflow',
  };
  const schoolParams = {
    className: 'swiper-centered-slides swiper-container p-1',
    slidesPerView: 'auto',
    watchSlidesProgress: true,
    spaceBetween: 20,
    centeredSlides: false,
    navigation: false,
    slideToClickedSlide: true,
    effect: 'coverflow',
  };
  return (
    <>
      {marketSiteSchoolContent.loading ? <div className="land-content"><Spinner /></div> : (
        <div className="app-content content">
          <div className="content-overlay" />
          <div className="">
            <div className="land-start page-header-background">
              <div className="container px-3 py-2">
                <Row>
                  <Col md="6" lg="5" sm="12" className="pt-1">
                    <div className="mt-2">
                      <h3 className="land-header-title">
                        {marketSiteSchoolContent.data?.title ? marketSiteSchoolContent.data.title : ''}
                      </h3>
                      <h3 className="land-header-title">
                        {marketSiteSchoolContent.data?.subTitle ? marketSiteSchoolContent.data.subTitle : ''}
                      </h3>
                    </div>
                    <div className="mb-2">
                      <span className="land-header-content">
                        {marketSiteSchoolContent.data?.content ? marketSiteSchoolContent.data.content : ''}
                      </span>
                    </div>
                    <div className="my-3">
                      <span className="page-logo-title">For Subs for You School Lunch Program </span>
                      <Link to="/register" className="align-items-center waves-effect">
                        <img className="" src={subsForYouImg} alt="Subs For You" height={20} />
                      </Link>
                    </div>
                  </Col>
                  <Col md="6" lg="7" sm="12">
                    <div className="p-1">
                      <img className="img-fluid" src={marketSiteSchoolContent.data?.contentLogo ? marketSiteSchoolContent.data?.contentLogo : backgroundImg} alt="background" />
                    </div>
                  </Col>
                </Row>
                <Row className="mb-2 mt-3">
                  <Col md="12" lg="12" sm="12">
                    <div className="d-flex justify-content-center">
                      <span className="land-works-title">How it works</span>
                    </div>
                  </Col>
                </Row>
                <Row className="my-2 land-works-page">
                  {marketSiteWorks.data.map((marketSiteWork, index) => (
                    <Col md="6" lg="3" sm="12" className="pl-1 pr-1" key={index}>
                      <div key={index}>
                        <div className="d-flex justify-content-center">
                          <div className="my-1">
                            <img className="img-fluid land-work" src={marketSiteWork.workLogo} alt={marketSiteWork.workTitle} />
                          </div>
                        </div>
                        <div className="d-flex justify-content-center">
                          <span className="land-works-sub-title">{marketSiteWork.workTitle}</span>
                        </div>
                        <div className="d-flex justify-content-center">
                          <div className="my-2">
                            <span className="land-works-sub-content">{marketSiteWork.workContent}</span>
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
            <div className="land-provide py-2 page-provide-background">
              <div className="container px-3 py-2">
                <Row className="my-3">
                  <Col md="12" lg="12" sm="12">
                    <div className="d-flex justify-content-center">
                      <span className="land-works-title">A bit more about Us</span>
                    </div>
                  </Col>
                </Row>
                {marketSiteProvides.data.map((provide, index) => (
                  <Row className="my-2 land-provide-page" key={index}>
                    <Col md="6" lg="6" sm="12">
                      {index % 2 === 0 ? (
                        <div className="d-flex justify-content-start">
                          <div className="my-1">
                            <img className="img-fluid land-provide-img" src={provide.provideLogo} alt={provide.title} />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="d-flex justify-content-start">
                            <div className="mt-3">
                              <span className="land-works-sub-title">{provide.title}</span>
                            </div>
                          </div>
                          <div className="d-flex justify-content-start">
                            <div className="my-2 land-provide-content">
                              <span className="land-works-sub-content">
                                {provide.content}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </Col>
                    <Col md="6" lg="6" sm="12">
                      {index % 2 !== 0 ? (
                        <div className="d-flex justify-content-start">
                          <div className="my-1">
                            <img className="img-fluid land-provide-img" src={provide.provideLogo} alt={provide.title} />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="d-flex justify-content-start">
                            <div className="mt-3">
                              <span className="land-works-sub-title">{provide.title}</span>
                            </div>
                          </div>
                          <div className="d-flex justify-content-start">
                            <div className="my-2 land-provide-content">
                              <span className="land-works-sub-content">
                                {provide.content}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </Col>
                  </Row>
                ))}
              </div>

            </div>
            <div className="land-partner-page py-2 page-partner-background">
              <div className="container px-3 py-2">
                <Row className="my-3">
                  <Col md="12" lg="12" sm="12">
                    <div className="d-flex justify-content-center">
                      <span className="land-works-title">Partners who work with us</span>
                    </div>
                  </Col>
                </Row>
                { marketSitePartners.data.map((partner, index) => (
                  <Row className="my-2" key={index}>
                    <Col md="6" lg="6" sm="12">
                      <div className="d-flex justify-content-start">
                        <div className="mt-1">
                          <span className="land-works-sub-title">{partner.title}</span>
                        </div>
                      </div>
                      <div className="d-flex justify-content-start">
                        <div className="my-2" style={{ marginRight: '4rem' }}>
                          <span className="land-works-sub-content">
                            {partner.content}
                          </span>
                        </div>
                      </div>
                      <div className="my-2">
                        <a href={partner.link} className="align-items-center waves-effect btn btn-primary btn-sm page-header-width">
                          <span className="page-header-title">
                            View
                            {' '}
                            {partner.title}
                          </span>
                        </a>
                      </div>
                    </Col>
                    <Col md="6" lg="6" sm="12" className="land-partner">
                      <div className="my-1">
                        <img className="img-fluid land-partner-img" src={partner.partnerLogo} alt={partner.title} />
                      </div>
                    </Col>
                  </Row>
                ))}
              </div>

            </div>
            <div className="land-feedback-page py-3 page-feedback-background">
              <div className="container py-2">
                <Row className="my-2 px-3">
                  <Col md="12" lg="12" sm="12">
                    <div className="d-flex justify-content-center">
                      <span className="land-works-title">What people say about Canteen Hub</span>
                    </div>
                  </Col>
                </Row>
                <div className="d-flex justify-content-center">
                  <Swiper dir="ltr" {...params}>
                    {marketSiteFeedbacks.data.map((feedback, index) => (
                      <SwiperSlide className="rounded swiper-shadow feedback-detail" key={index}>
                        <div className="land-quote avatar">
                          <span className="land-quote-content">“</span>
                        </div>
                        <p className="land-quote-comment">
                          {feedback.content}
                        </p>
                        <div className="land-quote-comment">
                          <span>{feedback.name}</span>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>

            </div>
            <div className="land-work-school page-school-background">
              <div className="container px-3 py-2">
                <Row className="my-3">
                  <Col md="12" lg="12" sm="12">
                    <div className="d-flex justify-content-center">
                      <span className="land-works-title">Schools who work with us</span>
                    </div>
                  </Col>
                </Row>
                <div className="d-flex justify-content-center">
                  <Swiper dir="ltr" {...schoolParams}>
                    {marketSiteSchools.data.map((school, index) => (
                      <SwiperSlide className="rounded swiper-shadow" key={index}>
                        <img src={school.schoolLogo} alt={school.schoolName} style={{ borderRadius: '8px', height: '100px' }} />
                        <p className="swiper-text align-middle pt-md-1 pt-sm-50 mb-0">{school.schoolName}</p>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
                <div className="mt-5 page-board-1">
                  <CardDeck>
                    <Card className="register-news-card">
                      <CardBody>
                        <CardText className="register-news-content" />
                        <div className="text-center">
                          <span className="register-news-title">Visit our library with latest newsletter, articles and 100’s of recipes for you to use at home.</span>
                        </div>
                      </CardBody>
                      <CardFooter className="register-landing-card-footer pb-3">
                        <Row className="d-flex justify-content-center">
                          <div className="register-news">
                            <div className="news-title-style">
                              <span className="register-news-btn-title">Click here for our latest news</span>
                            </div>
                            <div className="register-arrow">
                              <a href="/newsletter" className="register-round-btn">
                                <ArrowRight />
                              </a>
                            </div>
                          </div>
                        </Row>
                      </CardFooter>
                    </Card>
                    <Card className="register-service-card">
                      <CardBody>
                        <CardText className="register-service-content" />
                        <div className="text-center register-pad">
                          <span className="register-service-title">Having trouble or need more information?</span>
                        </div>
                      </CardBody>
                      <CardFooter className="register-landing-card-footer pb-3">
                        <Row className="d-flex justify-content-center">
                          <div className="register-landing-signup">
                            <Button.Ripple onClick={() => setModalQuestionVisibility(!modalQuestionVisibility)} color="primary" block>
                              Contact us here
                            </Button.Ripple>
                          </div>
                        </Row>
                      </CardFooter>
                    </Card>

                  </CardDeck>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
      <ModalQuestion modalVisibility={modalQuestionVisibility} modalToggle={() => toggleQuestionModal()} />
    </>
  );
};

export default SchoolPage;
