/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Link } from 'react-router-dom';
import themeConfig from '@configs/themeConfig';

const CustomPageFooter = (props) =>
  // const handleQuestion = (event) => {
  //   event.preventDefault();
  //   props.modalToggle();
  // };
  (
    <>
      <div className="d-flex justify-content-between mb-0">
        <div className="d-flex align-items-center">
          <Link to="/" className="navbar-brand">
            <span className="brand-logo">
              <img src={themeConfig.app.appLogoImage} alt="logo" />
            </span>
          </Link>
        </div>
        <div className="d-flex align-items-center d-page-none">
          <span className="float-md-right d-none d-md-block">
            <a href="/parents-care" rel="noopener noreferrer" className="mr-1">
              For Parents / Care givers
            </a>
            <a href="/for-schools" rel="noopener noreferrer" className="mr-1">
              For Schools
            </a>
            <a href="/for-stores" rel="noopener noreferrer" className="mr-1">
              For Store
            </a>
            {/* <a href="#" onClick={(event) => handleQuestion(event)} className="mr-1">
              Questions
            </a> */}
          </span>
        </div>
      </div>
    </>
  );
export default CustomPageFooter;
