// ** React Imports
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux';
import { getMenu } from '@store/actions/menu.actions';

// ** User View Components
import {
  Alert, Card, CardBody, Row, Col,
} from 'reactstrap';

import {
  Info,
} from 'react-feather';

// ** Components
import CardItemButton from '@src/components/cards/CardItemButton';

const MenuConfigForm = (props) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const selectedMenu = useSelector((state) => state.menus.selectedMenu);
  const menuData = useSelector((state) => state.menus.selectedMenu.menuData);
  const { currentCurrency } = props;
  // eslint-disable-next-line no-unused-vars
  const [itemsSelected, setItemsSelected] = useState([]);

  // ** Get data on mount
  useEffect(() => {
    dispatch(getMenu(id));
  }, []);

  // eslint-disable-next-line no-unused-vars
  const handleMenuItemClick = (selected) => {
    // do nothing. used for component at other times
  };

  return (
    <>
      <div className="d-flex justify-content-start mb-0">
        <Alert color="info">
          <div className="alert-body">
            <Info className="mr-1 " />
            {' '}
            This menu is a default menu created by Admin. You cannot edit this menu, however you can create a variation of it which then can be edited.
          </div>
        </Alert>
      </div>

      {menuData.map((category, i) => (
        <Card key={`${category.catName} ${i}`}>
          <CardBody>

            <div className="d-flex justify-content-between align-items-bottom mb-1">
              <h5 className="mr-auto">{category.catName}</h5>
            </div>

            {category.items && category.items.length > 0 ? (
              <Row className="items-wrapper justify-content-start">

                {category.items.map((item, i) => (
                  <Col sm="6" lg="4" className="mb-1" key={i}>
                    <CardItemButton
                      item={item}
                      menu={selectedMenu}
                      index={i}
                      size="sm"
                      handleMenuItemClick={handleMenuItemClick}
                      itemsSelected={itemsSelected}
                      currentCurrency={currentCurrency}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <>
                <small className="text-info d-flex align-items-bottom">
                  <Info className="mr-1 " size={15} />
                  {' '}
                  No menu items
                </small>
              </>
            )}
          </CardBody>
        </Card>
      ))}
    </>
  );
};

export default MenuConfigForm;
