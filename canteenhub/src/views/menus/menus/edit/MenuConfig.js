// ** React Imports
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux';
import { getMenu, getMenuOptionsFromParent } from '@store/actions/menu.actions';

import { fetchUnavailableOptions } from '@src/utility/functions/menus';
import { getLoggedUser } from '@utils';

// ** User View Components
import {
  Alert, Button, Card, CardBody, DropdownToggle, DropdownItem, DropdownMenu, Row, Col, UncontrolledDropdown, UncontrolledButtonDropdown,
} from 'reactstrap';

import {
  Layers, Plus, Info, Edit3, Trash, MoreVertical, Share2,
} from 'react-feather';

// ** Components
import CardItemButton from '@src/components/cards/CardItemButton';

import ModalMenuPermissions from './ModalMenuPermissions';
import ModalAddCategory from './ModalAddCategory';
import ModalEditCategory from './ModalEditCategory';
import ModalDeleteCategory from './ModalDeleteCategory';
import ModalSortCategory from './ModalSortCategory';
import ModalOptionAvailability from './ModalOptionAvailability';

import ModalAddItem from './ModalAddItem';
import ModalEditItem from './ModalEditItem';

const MenuConfigForm = (props) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const selectedMenu = useSelector((state) => state.menus.selectedMenu);
  const menuOptions = useSelector((state) => state.menus.menuOptions);
  const menuData = useSelector((state) => state.menus.selectedMenu.menuData);
  const loggedUser = getLoggedUser();
  const { currentCurrency } = props;

  const [unvailableOptions, setUnvailableOptions] = useState({});

  const [activeCategory, setActiveCategory] = useState();
  // eslint-disable-next-line no-unused-vars
  const [itemsSelected, setItemsSelected] = useState([]);
  const [itemSelectedForEdit, setItemSelectedForEdit] = useState('');

  // Vendor Permission Modals
  const [modalPermissionVisibility, setModalPermissionVisibility] = useState(false);
  const togglePermissionModal = () => { setModalPermissionVisibility(!modalPermissionVisibility); };

  // Category Modals
  const [modalAddCategoryVisibility, setModalAddCategoryVisibility] = useState(false);
  const toggleAddCategoryModal = () => { setModalAddCategoryVisibility(!modalAddCategoryVisibility); };

  const [modalEditCategoryVisibility, setModalEditCategoryVisibility] = useState(false);
  const toggleEditCategoryModal = () => { setModalEditCategoryVisibility(!modalEditCategoryVisibility); };

  const [modalDeleteCategoryVisibility, setModalDeleteCategoryVisibility] = useState(false);
  const toggleDeleteCategoryModal = () => { setModalDeleteCategoryVisibility(!modalDeleteCategoryVisibility); };
  const [modalSortCategoryVisibility, setModalSortCategoryVisibility] = useState(false);
  const toggleSortCategoryModal = () => { setModalSortCategoryVisibility(!modalSortCategoryVisibility); };

  // Option Availability Modal
  const [modalOptionAvailabilityVisibility, setModalOptionAvailabilityVisibility] = useState(false);
  const toggleOptionAvailabilityModal = () => { setModalOptionAvailabilityVisibility(!modalOptionAvailabilityVisibility); };

  // Item Modals
  const [modalAddItemVisibility, setModalAddItemVisibility] = useState(false);
  const toggleAddItemModal = () => { setModalAddItemVisibility(!modalAddItemVisibility); };

  const [modalEditItemVisibility, setModalEditItemVisibility] = useState(false);
  const toggleEditItemModal = () => { setModalEditItemVisibility(!modalEditItemVisibility); };

  // ** Get data on mount
  useEffect(() => {
    dispatch(getMenu(id));
    dispatch(getMenuOptionsFromParent(id));
  }, []);

  // ** Get data on mount
  useEffect(() => {
    if (!selectedMenu) return false;
    if (!menuOptions) return false;
    setUnvailableOptions(fetchUnavailableOptions(selectedMenu, menuOptions));
    return false;
  }, [selectedMenu, menuOptions]);

  // eslint-disable-next-line no-unused-vars
  const handleMenuItemClick = (selected) => {
    toggleEditItemModal();
    setItemSelectedForEdit(selected);
  };

  return (
    <>
      {menuData.length > 0 ? (

        <>

          <div className="d-flex justify-content-end mb-1">
            <UncontrolledButtonDropdown>
              <DropdownToggle color="info" size="sm" outline caret>
                Manage menu
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem onClick={() => toggleAddCategoryModal()}>
                  {' '}
                  <Plus size="16" />
                  {' '}
                  Add category
                </DropdownItem>
                <DropdownItem onClick={() => toggleOptionAvailabilityModal()}>
                  {' '}
                  <Plus size="16" />
                  {' '}
                  Option availability
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>

            {/* <Button.Ripple color="primary" outline size="xs" onClick={() => toggleAddCategoryModal()}>
              <Plus size="16" />
              {' '}
              Add category
            </Button.Ripple> */}
            {loggedUser.role === 'admin' ? (
              <Button.Ripple color="primary" className="ml-1" outline size="sm" onClick={() => togglePermissionModal()}>
                <Share2 size="16" />
                {' '}
                Vendors
                {' '}
                {selectedMenu.vendors ? `(${selectedMenu.vendors.length})` : ''}
              </Button.Ripple>
            ) : '' }
          </div>

          {unvailableOptions && unvailableOptions.length > 0 ? (
            <Alert color="secondary">
              <div className="alert-body">
                <Info className="mr-1 " />
                {' '}
                Unavailable options:
                {' '}
                {unvailableOptions.map((option) => option.name).join(', ')}
                {' '}
                {/* {selectedMenu && menuOptions > 0 ? getUnavailableOptions(selectedMenu, menuOptions).map((option) => option.name).join(', ') : ''} */}
                {/* {fetchUnavailableOptions(selectedMenu, menuOptions)} */}
                <Button.Ripple color="flat-secondary" className="btn-xs " onClick={() => toggleOptionAvailabilityModal()}>edit</Button.Ripple>
              </div>
            </Alert>
          ) : ''}

        </>
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
      )}

      {menuData.map((category, i) => (
        <Card key={`${category.catName} ${i}`}>
          <CardBody>

            <div className="d-flex justify-content-between align-items-bottom mb-1">
              <h5 className="mr-auto">{category.catName}</h5>

              <div>
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
              </div>
              <UncontrolledDropdown>
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
              </UncontrolledDropdown>

            </div>

            {category.items && category.items.length > 0 ? (
              <Row className="items-wrapper justify-content-start">

                {category.items.map((item, i) => ((item.status !== 'deleted') ? (
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
                ) : ''))}

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
      <ModalAddItem modalVisibility={modalAddItemVisibility} modalToggle={() => toggleAddItemModal()} selectedMenu={selectedMenu} selectedCategory={activeCategory} loggedUserRole={loggedUser.role} currentCurrency={currentCurrency} />
      <ModalEditItem modalVisibility={modalEditItemVisibility} modalToggle={() => toggleEditItemModal()} selectedMenu={selectedMenu} selectedItem={itemSelectedForEdit} loggedUserRole={loggedUser.role} currentCurrency={currentCurrency} />

      {loggedUser.role === 'admin' ? (
        <ModalMenuPermissions modalVisibility={modalPermissionVisibility} modalToggle={() => togglePermissionModal()} selectedMenu={selectedMenu} />
      ) : '' }

      {/* Category Modals */}
      <ModalAddCategory modalVisibility={modalAddCategoryVisibility} modalToggle={() => toggleAddCategoryModal()} selectedMenu={selectedMenu} selectedCategory={activeCategory} />
      <ModalEditCategory modalVisibility={modalEditCategoryVisibility} modalToggle={() => toggleEditCategoryModal()} selectedMenu={selectedMenu} selectedCategory={activeCategory} />
      <ModalDeleteCategory modalVisibility={modalDeleteCategoryVisibility} modalToggle={() => toggleDeleteCategoryModal()} selectedMenu={selectedMenu} selectedCategory={activeCategory} />
      <ModalSortCategory modalVisibility={modalSortCategoryVisibility} modalToggle={() => toggleSortCategoryModal()} selectedMenu={selectedMenu} selectedCategory={activeCategory} />

      {/* Option Availability Modal */}
      <ModalOptionAvailability modalVisibility={modalOptionAvailabilityVisibility} modalToggle={() => toggleOptionAvailabilityModal()} selectedMenu={selectedMenu} />

    </>
  );
};

export default MenuConfigForm;
