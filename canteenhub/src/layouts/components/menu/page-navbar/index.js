// ** React Imports
import { Fragment } from 'react';

// ** Custom Components
import NavbarPage from './NavbarPage';

const ThemePageNavbar = (props) => {
  // ** Props
  const { menuVisibility, setMenuVisibility } = props;

  return (
    <>
      <NavbarPage menuVisibility={menuVisibility} setMenuVisibility={setMenuVisibility} />
    </>
  );
};

export default ThemePageNavbar;
