// !Do not remove the Layout import
// import Layout from '@layouts/HorizontalLayout';
import Layout from '@src/layouts/coreoverrides/HorizontalLayout';

// ** Components
// import CustomMenu from './components/menu/horizontal-menu'; // Hidden
import CustomNavbar from './components/menu/navbar';
import CustomFooter from './components/Footer';

const HorizontalLayout = (props) => (
  <Layout
    // menu={(props) => <CustomMenu {...props} />}
    navbar={(props) => <CustomNavbar {...props} />}
    footer={(props) => <CustomFooter {...props} />}
    {...props}
  >
    {props.children}
  </Layout>
);

export default HorizontalLayout;
