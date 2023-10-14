// ** React Imports
import { Fragment } from 'react';

// ** Custom Components
import NavbarUser from './NavbarUser';

const ThemeNavbar = (props) => {
  // ** Props
  const { skin, setSkin, setMenuVisibility } = props;

  return (
    <>
      <NavbarUser skin={skin} setSkin={setSkin} setMenuVisibility={setMenuVisibility} />
    </>
  );
};

export default ThemeNavbar;
