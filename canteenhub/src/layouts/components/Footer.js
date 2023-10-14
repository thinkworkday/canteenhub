const CustomFooter = (props) => (
  <p className="clearfix mb-0 ">
    <span className="float-md-left d-block d-md-inline-block mt-25">
      Copyright&copy;
      {' '}
      {new Date().getFullYear()}
      {' '}
      Canteen Hub Australia
    </span>
    <span className="float-md-right d-none d-md-block">
      <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="mr-1">
        Terms & Conditions
      </a>
      <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
        Privacy Policy
      </a>
    </span>
  </p>
);

export default CustomFooter;
