// ** React Imports
import { Fragment } from 'react';

// ** Custom Components
import NavbarAdmin from './NavbarAdmin';

const ThemeNavbar = (props) => {
  // ** Props
  const { skin, setSkin, setMenuVisibility } = props;

  return (
    <>
      <NavbarAdmin skin={skin} setSkin={setSkin} setMenuVisibility={setMenuVisibility} />
    </>
  );
};

export default ThemeNavbar;
