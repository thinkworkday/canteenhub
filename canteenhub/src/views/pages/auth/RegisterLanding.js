/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-unescaped-entities */
import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook, Twitter, Mail, GitHub, ArrowRight,
} from 'react-feather';
import InputPasswordToggle from '@components/input-password-toggle';
import {
  Card, CardBody, CardTitle, CardText, Form, FormGroup, Label, Input, CustomInput, Button,
  CardDeck, CardImg, CardFooter, Row,
} from 'reactstrap';
import '@styles/base/pages/page-auth.scss';

import schoolImg from '@src/assets/images/pages/school.png';
import storeImg from '@src/assets/images/pages/store.png';
import parentImg from '@src/assets/images/pages/parent.png';
import subsForYouImg from '@src/assets/images/pages/subs-for-you-green.png';
// import themeConfig from '@configs/themeConfig';
import ModalQuestion from '../../../components/modals/ModalQuestion';

const RegisterV1 = () => {
  const [modalQuestionVisibility, setModalQuestionVisibility] = useState(false);
  const toggleQuestionModal = () => {
    setModalQuestionVisibility(!modalQuestionVisibility);
  };
  const RememberMe = () => (
    <>
      I agree to
      <a className="ml-25" href="/" onClick={(e) => e.preventDefault()}>
        privacy policy & terms
      </a>
    </>
  );

  return (
    <>
      <div className="auth-wrapper auth-register-landing">
        <div className="auth-inner pb-4">
          <div className="text-center mt-5 mb-3 register-landing-title">
            <span>
              Subs for You School Lunch Program
              {' '}
            </span>
            <img className="" src={subsForYouImg} alt="Subs For You" height={40} />
            <span>
              {' '}
              I am a...
            </span>
          </div>
          <CardDeck>
            <Card>
              <div className="d-flex mt-3 justify-content-center">
                <img className="img-responsive" src={parentImg} alt="Parent/Care Giver" />
              </div>
              <CardBody>
                <CardTitle tag="h4" className="text-center register-landing-title">Parent/Care Giver</CardTitle>
                <CardText className="register-landing-content">
                  4 easy quick steps and you’re ready to order. Take the stress out of school lunches.
                </CardText>
              </CardBody>
              <CardFooter className="register-landing-card-footer">
                <Row className="d-flex justify-content-center">
                  <div className="register-landing-signup">
                    <Button.Ripple tag={Link} to="/register-customer" color="primary" block>
                      Sign up
                    </Button.Ripple>
                  </div>
                </Row>
                <Row className="d-flex justify-content-center">
                  <div className="mt-2">
                    <a href="/parents-care" className="register-landing-more-info">
                      <span>More Info</span>
                    </a>
                  </div>
                </Row>
              </CardFooter>
            </Card>
            <Card>
              <div className="d-flex mt-3 justify-content-center">
                <img className="img-responsive" src={schoolImg} alt="School" />
              </div>
              <CardBody>
                <CardTitle tag="h4" className="text-center register-landing-title">School</CardTitle>
                <CardText className="register-landing-content">Nominate your co-ordinator then register your school details and the classes within the school. Your local food supplier will send an invite to partner your school. We take care of the rest. We also manage the parents.</CardText>
              </CardBody>
              <CardFooter className="register-landing-card-footer">
                <Row className="d-flex justify-content-center">
                  <div className="register-landing-signup">
                    <Button.Ripple tag={Link} to="/register-group" color="primary" block>
                      Sign up
                    </Button.Ripple>
                  </div>
                </Row>
                <Row className="d-flex justify-content-center">
                  <div className="mt-2">
                    <a href="/for-schools" className="register-landing-more-info">
                      <span>More Info</span>
                    </a>
                  </div>
                </Row>
              </CardFooter>
            </Card>
            <Card>
              <div className="d-flex mt-3 justify-content-center">
                <img className="img-responsive" src={storeImg} alt="Store" />
              </div>
              <CardBody>
                <CardTitle tag="h4" className="text-center register-landing-title">Store</CardTitle>
                <CardText className="register-landing-content">
                  Register your details and set up your bank account. We will take over from there, the rest is easy.
                </CardText>
              </CardBody>
              <CardFooter className="register-landing-card-footer">
                <Row className="d-flex justify-content-center">
                  <div className="register-landing-signup">
                    <Button.Ripple tag={Link} to="/register-partner" color="primary" block>
                      Sign up
                    </Button.Ripple>
                  </div>
                </Row>
                <Row className="d-flex justify-content-center">
                  <div className="mt-2">
                    <a href="/for-stores" className="register-landing-more-info">
                      <span>More Info</span>
                    </a>
                  </div>
                </Row>
              </CardFooter>
            </Card>
          </CardDeck>

          {/* <div className="divider my-2">
        <div className="divider-text">or</div>
      </div> */}

          <div className="mt-5">
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

          <p className="text-center mt-5">
            <span className="mr-25">Already have an account?</span>
            <Link to="/login">
              <span>Sign in instead</span>
            </Link>
          </p>
        </div>
      </div>
      <ModalQuestion modalVisibility={modalQuestionVisibility} modalToggle={() => toggleQuestionModal()} />

    </>

  );
};

export default RegisterV1;
