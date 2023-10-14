/* eslint-disable react/jsx-no-undef */
import { useState, useEffect } from 'react';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';
import {
  getMenuItems, getMenuItemsFromParent, getMenu, updateMenu,
} from '@store/actions/menu.actions';

// ** Reactstrap
import {
  Row, Col, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, InputGroupAddon, InputGroupText,
} from 'reactstrap';

// ** Components
import CardItemRow from '@src/components/cards/CardItemRow';
// ** Utils

// ** Third Party Components
import { toast } from 'react-toastify';
import {
  Search,
} from 'react-feather';
// import UILoader from '@components/ui-loader';

// import { Search } from 'react-feather';

const ModalAddCategory = (props) => {
  const {
    selectedMenu, selectedCategory, loggedUserRole, currentCurrency,
  } = props;
  const store = useSelector((state) => state.records);
  const dispatch = useDispatch();

  // ** States
  const [selectedMenuRaw, setSelectedMenuRaw] = useState([]);
  const [itemsSelected, setItemsSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState(store.params?.q ? store.params.q : '');
  const [currentPage, setCurrentPage] = useState(store.params?.currentPage ? store.params.currentPage : 1);
  const [rowsPerPage, setRowsPerPage] = useState(store.params?.rowsPerPage ? store.params.rowsPerPage : 1000000);

  // Set dispatch construct
  const dispatchParams = {
    currentPage,
    rowsPerPage,
    q: searchTerm,
  };

  const [isProcessing, setProcessing] = useState(false);

  // ** Get data on mount
  useEffect(() => {
    if (loggedUserRole === 'vendor') {
      dispatch(getMenuItemsFromParent(selectedMenu._id));
    } else {
      dispatch(getMenuItems(dispatchParams));
    }
    setItemsSelected(selectedCategory && selectedCategory.items ? selectedCategory.items.map((itemObj) => itemObj._id) : []);

    // format SelectedMenu
    const selectedMenuFormatted = selectedMenu.menuData.map((obj) => {
      let cleanObj;
      if (obj.items) {
        cleanObj = obj.items.map((obj) => obj._id);
      }
      if (cleanObj) {
        cleanObj = {
          catName: obj.catName,
          items: cleanObj,
        };
      }
      return !cleanObj ? obj : cleanObj;
    });

    // console.log(selectedMenuFormatted);
    setSelectedMenuRaw(selectedMenuFormatted);
  }, [dispatch, store.data.length, selectedCategory]);

  // ** Function in get data on search query change
  const handleFilter = (q) => {
    setSearchTerm(q);
    dispatch(
      getMenuItems({
        ...dispatchParams,
        q,
      })
    );
  };

  const handleClose = async () => {
    props.modalToggle();
  };

  const handleMenuItemClick = (selected) => {
    // console.log(selected);
    const index = itemsSelected.indexOf(selected);
    if (index < 0) {
      itemsSelected.push(selected);
    } else {
      itemsSelected.splice(index, 1);
    }
    setItemsSelected([...itemsSelected]);
  };

  const onSubmit = async () => {
    // update the category
    const updatedMenuData = selectedMenuRaw;

    // Add selected items
    const updatedCatData = selectedCategory;
    const index = updatedMenuData.findIndex((c) => c.catName === selectedCategory.catName);
    updatedCatData.items = itemsSelected;
    updatedMenuData[index] = updatedCatData;

    try {
      await dispatch(updateMenu(selectedMenu._id, { menuData: updatedMenuData }));
      await dispatch(getMenu(selectedMenu._id));
      toast.success('Menu Updated');
      handleClose();
      setProcessing(false);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      setProcessing(false);
    }
  };

  return (
    <Modal scrollable isOpen={props.modalVisibility} className="modal-lg modal-menu-add-items" toggle={() => props.modalToggle()}>
      <ModalHeader toggle={() => props.modalToggle()}>{selectedCategory ? selectedCategory.catName : ''}</ModalHeader>
      <ModalBody>
        <Row className="mb-2 search-wrapper">
          <Col
            className="d-flex align-items-center "
          >
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <Search size={14} />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                id="search-user"
                type="text"
                value={searchTerm}
                onChange={(e) => handleFilter(e.target.value ? e.target.value : '')}
                autoComplete="off"
                placeholder="Search for item using name or tag"
              />
            </InputGroup>
            {searchTerm && (<Button.Ripple size="sm" className="clear-link d-block" onClick={() => { handleFilter(''); }} color="flat-light">clear</Button.Ripple>)}
          </Col>
        </Row>

        { store.data.map((item, i) => (
          <CardItemRow
            key={i}
            item={item}
            index={i}
            size="sm"
            handleMenuItemClick={handleMenuItemClick}
            itemsSelected={itemsSelected}
            currentCurrency={currentCurrency}
            loggedUserRole={loggedUserRole}
          />
        ))}

      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={() => onSubmit()}>
          Save
        </Button>
        <Button.Ripple outline color="flat-secondary" onClick={() => handleClose()}>
          Cancel
        </Button.Ripple>
      </ModalFooter>
    </Modal>
  );
};

export default ModalAddCategory;
