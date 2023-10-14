// !Do not remove the Layout import
import Layout from '@src/layouts/coreoverrides/VerticalLayout';

// ** Components
import CustomMenu from './components/menu/vertical-menu'; // Sidebar
import CustomNavbar from './components/menu/navbar-admin'; // Topbar
import CustomFooter from './components/FooterAdmin';

const VerticalLayout = (props) => (
  <Layout
    menu={(props) => <CustomMenu {...props} />} // Vertical Sidebar Menu
    navbar={(props) => <CustomNavbar {...props} />} // Topbar
    footer={(props) => <CustomFooter {...props} />}
    {...props}
  >
    {props.children}
  </Layout>
);

export default VerticalLayout;
