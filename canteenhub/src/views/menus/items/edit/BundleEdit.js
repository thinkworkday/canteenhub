/* eslint-disable react/jsx-no-undef */
import { useState, useEffect } from 'react';

// ** Store & Actions
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';

// ** Reactstrap
// import Avatar from '@components/avatar';
import {
  Alert, Card, CardBody, FormGroup, Row, Col, Input, Form, Button, Label, Spinner, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';

// ** Third Party Components
import { toast } from 'react-toastify';

// ** Utils
import { isObjEmpty } from '@utils';

// ** Store & Actions
import { getMenu, updateMenu } from '@store/actions/menu.actions';

// ** Third Party Components
import classnames from 'classnames';
import {
  HelpCircle, CheckCircle,
} from 'react-feather';
import UILoader from '@components/ui-loader';

// import { Search } from 'react-feather';

const BundleEdit = (props) => {
  const dispatch = useDispatch();
  const { selectedRecord } = props;

  const {
    register, errors, handleSubmit, setValue, clearErrors, control,
  } = useForm();
  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  const onSubmit = async (data) => {
    setProcessing(true);
    alert('on submit');
    // const { menuData } = selectedRecord;
    // const { catName } = data;
    // const catNameObj = { [catName]: { items: [] } };
    // const menuDataNew = [...menuData, catNameObj];

    // if (isObjEmpty(errors)) {
    //   // set vendor to current user (logged in as vendor) - if admin then need to manually specify
    //   try {
    //     await dispatch(updateMenu(selectedRecord._id, { menuData: menuDataNew }));
    //     await dispatch(getMenu(selectedRecord._id));
    //     toast.success(
    //       <>
    //         <CheckCircle className="mr-1 text-success" />
    //         Record updated
    //       </>,
    //     );
    //     handleClose();
    //     setProcessing(false);
    //   } catch (err) {
    //     if (err.response && err.response.status === 500) {
    //       setApiErrors({ data: 'Could not upload image. File format error' });
    //     } else {
    //       // setApiErrors(err.response ? err.response : { data: err.response.data });
    //     }
    //     setProcessing(false);
    //   }
    // }
  };

  return (
    <>

    </>

  );
};

export default BundleEdit;
