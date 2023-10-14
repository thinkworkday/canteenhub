/* eslint-disable react/jsx-no-undef */
import { useState, useEffect } from 'react';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';
import { getMenuItems, getMenu, updateMenu } from '@store/actions/menu.actions';
import { useForm, Controller } from 'react-hook-form';
import { getUsers } from '@store/actions/user.actions';

// ** Reactstrap
import {
  Row, Col, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Form, InputGroupText,
} from 'reactstrap';

// ** Components
import CardItemRow from '@src/components/cards/CardItemRow';
// ** Utils

// ** Third Party Components
import CreatableSelect from 'react-select/creatable';
import { toast } from 'react-toastify';
import {
  Search,
} from 'react-feather';
import UILoader from '@components/ui-loader';

// import { Search } from 'react-feather';

const myTags = [
  {
    value: 'this', label: 'this too',
  },
];

const ModalAddCategory = (props) => {
  const { selectedMenu, selectedCategory } = props;
  // const store = useSelector((state) => state.records);
  const store = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const {
    register, errors, handleSubmit, setValue, clearErrors, control,
  } = useForm();

  // ** States
  const [vendorList, setVendorList] = useState([]);

  const [selectedMenuRaw, setSelectedMenuRaw] = useState([]);
  const [itemsSelected, setItemsSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState(store.params?.q ? store.params.q : '');
  const [currentPage, setCurrentPage] = useState(store.params?.currentPage ? store.params.currentPage : 1);
  const [rowsPerPage, setRowsPerPage] = useState(store.params?.rowsPerPage ? store.params.rowsPerPage : 1000000);

  // console.log('selectedMenuRaw', selectedMenuRaw);

  // Set dispatch construct
  const dispatchParams = {
    currentPage,
    rowsPerPage,
    role: 'vendor',
    q: searchTerm,
  };

  const [isProcessing, setProcessing] = useState(false);

  // ** Get data on mount
  useEffect(() => {
    dispatch(getUsers(dispatchParams));

    const vendorListObj = store.data.map((vendor) => ({ value: vendor._id, label: vendor.companyName }));

    setVendorList(vendorListObj);
  }, [dispatch, store.data.length]);

  // useEffect(() => {
  //   dispatch(getMenuItems(dispatchParams));
  //   setItemsSelected(selectedCategory && selectedCategory.items ? selectedCategory.items.map((itemObj) => itemObj._id) : []);
  // }, [dispatch, store.data.length, selectedCategory]);

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

  const onSubmit = async (data) => {
    console.log('Submit', data);
    // // update the category
    // const updatedMenuData = selectedMenuRaw;

    // // Add selected items
    // const updatedCatData = selectedCategory;
    // const index = updatedMenuData.findIndex((c) => c.catName === selectedCategory.catName);
    // updatedCatData.items = itemsSelected;
    // updatedMenuData[index] = updatedCatData;

    // try {
    //   await dispatch(updateMenu(selectedMenu._id, { menuData: updatedMenuData }));
    //   await dispatch(getMenu(selectedMenu._id));
    //   toast.success('Menu Updated');
    //   handleClose();
    //   setProcessing(false);
    // } catch (err) {
    //   // eslint-disable-next-line no-console
    //   console.log(err);
    //   setProcessing(false);
    // }
  };

  return (

    <Form id="formMenuPermissions">
      <Modal isOpen={props.modalVisibility} className="" toggle={() => props.modalToggle()}>
        <ModalHeader toggle={() => props.modalToggle()}>Vendor Permissions</ModalHeader>
        <ModalBody>

          <p>Select the vendor(s) who are able to use this menu</p>

          <FormGroup>
            <section>
              <Controller
                as={CreatableSelect}
                options={vendorList}
                name="vendors"
                isMulti
                isClearable={false}
                control={control}
                className="react-select"
                classNamePrefix="select"
              />
            </section>
          </FormGroup>

          {/* { store.data.map((item, i) => (
          <CardItemRow
            key={i}
            item={item}
            index={i}
            size="sm"
            handleMenuItemClick={handleMenuItemClick}
            itemsSelected={itemsSelected}
          />
        ))} */}

        </ModalBody>
        <ModalFooter>

          <Button.Ripple id="triggerFormSubmit" onClick={handleSubmit()} className="mr-1 d-flex" color="primary" disabled={isProcessing}>
            {isProcessing && (
            <div className="d-flex align-items-center mr-1">
              <Spinner color="light" size="sm" />
            </div>
            )}
            <span>Submit</span>
          </Button.Ripple>

          <Button color="primary" onClick={() => onSubmit()}>
            Save
          </Button>
          <Button.Ripple outline color="flat-secondary" onClick={() => handleClose()}>
            Cancel
          </Button.Ripple>
        </ModalFooter>
      </Modal>
    </Form>
  );
};

export default ModalAddCategory;
