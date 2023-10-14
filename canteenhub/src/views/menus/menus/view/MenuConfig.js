// ** React Imports
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux';
import { getMenu, updateMenu } from '@store/actions/menu.actions';
// ** User View Components
import {
  Alert, Button, Card, CardBody, UncontrolledButtonDropdown, DropdownToggle, DropdownItem, DropdownMenu, Row, Col, UncontrolledDropdown,
} from 'reactstrap';

import {
  Settings, Layers, Plus, Info, Edit3, Trash, MoreVertical, Share2,
} from 'react-feather';

// ** Components
import CardItemButton from '@src/components/cards/CardItemButton';

// import ModalMenuPermissions from './ModalMenuPermissions';
// import ModalAddCategory from './ModalAddCategory';
// import ModalEditCategory from './ModalEditCategory';
// import ModalDeleteCategory from './ModalDeleteCategory';
// import ModalSortCategory from './ModalSortCategory';

// import ModalAddItem from './ModalAddItem';

const MenuConfigForm = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const selectedMenu = useSelector((state) => state.menus.selectedMenu);
  const menuData = useSelector((state) => state.menus.selectedMenu.menuData);

  const [activeCategory, setActiveCategory] = useState();
  const [itemsSelected, setItemsSelected] = useState([]);

  // Vendor Permission Modals
  // const [modalPermissionVisibility, setModalPermissionVisibility] = useState(false);
  // const togglePermissionModal = () => { setModalPermissionVisibility(!modalPermissionVisibility); };

  // Category Modals
  // const [modalAddCategoryVisibility, setModalAddCategoryVisibility] = useState(false);
  // const toggleAddCategoryModal = () => { setModalAddCategoryVisibility(!modalAddCategoryVisibility); };

  // const [modalEditCategoryVisibility, setModalEditCategoryVisibility] = useState(false);
  // const toggleEditCategoryModal = () => { setModalEditCategoryVisibility(!modalEditCategoryVisibility); };

  // const [modalDeleteCategoryVisibility, setModalDeleteCategoryVisibility] = useState(false);
  // const toggleDeleteCategoryModal = () => { setModalDeleteCategoryVisibility(!modalDeleteCategoryVisibility); };
  // const [modalSortCategoryVisibility, setModalSortCategoryVisibility] = useState(false);
  // const toggleSortCategoryModal = () => { setModalSortCategoryVisibility(!modalSortCategoryVisibility); };

  // Item Modals
  // const [modalAddItemVisibility, setModalAddItemVisibility] = useState(false);
  // const toggleAddItemModal = () => { setModalAddItemVisibility(!modalAddItemVisibility); };

  // ** Get data on mount
  useEffect(() => {
    dispatch(getMenu(id));
  }, []);

  const handleMenuItemClick = (selected) => {
    // do nothing. used for component at other times
  };

  return (
    <>
      {/* {menuData.length > 0 ? (
        <div className="d-flex justify-content-end mb-2">
          <Button.Ripple color="primary" outline size="xs" onClick={() => toggleAddCategoryModal()}>
            <Plus size="16" />
            {' '}
            Add category
          </Button.Ripple>
          <Button.Ripple color="primary" className="ml-1" outline size="xs" onClick={() => togglePermissionModal()}>
            <Share2 size="16" />
            {' '}
            Vendors
            {' '}
            {selectedMenu.vendors ? `(${selectedMenu.vendors.length})` : ''}
          </Button.Ripple>
        </div>
      ) : (
        <>
          <Alert color="info">
            <div className="alert-body">
              <Info className="mr-1 " />
              {' '}
              Start building your menu by adding your first category
            </div>
          </Alert>
          <Button.Ripple outline color="primary" size="sm" onClick={() => toggleAddCategoryModal()}>
            <Plus size="16" />
            {' '}
            Add category
          </Button.Ripple>
        </>
      )} */}

      {menuData.map((category, i) => (
        <Card key={`${category.catName} ${i}`}>
          <CardBody>

            <div className="d-flex justify-content-between align-items-bottom mb-1">
              <h5 className="mr-auto">{category.catName}</h5>

              {/* <div>
                <Button.Ripple
                  outline
                  color="info"
                  size="xs"
                  onClick={() => {
                    setActiveCategory(category);
                    toggleAddItemModal();
                  }}
                >
                  Manage items
                </Button.Ripple>
              </div> */}
              {/* <UncontrolledDropdown>
                <DropdownToggle tag="div" className="btn btn-sm pt-0">
                  <MoreVertical size={16} className="cursor-pointer action-btn" />
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem
                    className="w-100"
                    onClick={() => {
                      setActiveCategory(category);
                      toggleEditCategoryModal();
                    }}
                  >
                    <Edit3 size="16" />
                    {' '}
                    Rename category
                  </DropdownItem>
                  <DropdownItem
                    className="w-100"
                    onClick={() => {
                      toggleSortCategoryModal();
                    }}
                  >
                    <Layers size="16" />
                    {' '}
                    Change position
                  </DropdownItem>
                  <DropdownItem
                    className="w-100"
                    onClick={() => {
                      setActiveCategory(category);
                      toggleDeleteCategoryModal();
                    }}
                  >
                    <Trash size="16" />
                    {' '}
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown> */}

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

      {/* Modals */}
      {/* <ModalAddItem modalVisibility={modalAddItemVisibility} modalToggle={() => toggleAddItemModal()} selectedMenu={selectedMenu} selectedCategory={activeCategory} /> */}
      {/* <ModalMenuPermissions modalVisibility={modalPermissionVisibility} modalToggle={() => togglePermissionModal()} selectedMenu={selectedMenu} /> */}

      {/* Category Modals */}
      {/* <ModalAddCategory modalVisibility={modalAddCategoryVisibility} modalToggle={() => toggleAddCategoryModal()} selectedMenu={selectedMenu} selectedCategory={activeCategory} />
      <ModalEditCategory modalVisibility={modalEditCategoryVisibility} modalToggle={() => toggleEditCategoryModal()} selectedMenu={selectedMenu} selectedCategory={activeCategory} />
      <ModalDeleteCategory modalVisibility={modalDeleteCategoryVisibility} modalToggle={() => toggleDeleteCategoryModal()} selectedMenu={selectedMenu} selectedCategory={activeCategory} />
      <ModalSortCategory modalVisibility={modalSortCategoryVisibility} modalToggle={() => toggleSortCategoryModal()} selectedMenu={selectedMenu} selectedCategory={activeCategory} /> */}

    </>
  );
};

export default MenuConfigForm;
