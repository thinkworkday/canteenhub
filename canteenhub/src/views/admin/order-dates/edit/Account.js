/* eslint-disable react/jsx-key */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useForm, Controller } from 'react-hook-form';

import {
  Alert, Card, CardBody, FormGroup, Row, Col, Input, Form, Button, Label, Spinner, UncontrolledTooltip,
} from 'reactstrap';

// ** Utils
import { isObjEmpty } from '@utils';

// ** Store & Actions
// import { AbilityContext } from '@src/utility/context/Can';
// import { updateUser } from '@store/actions/user.actions';
import { updateStore, getStoreUsers } from '@store/actions/vendor.actions';

// ** Third Party Components
import Autocomplete from 'react-google-autocomplete';
import Select from 'react-select';
import classnames from 'classnames';
import {
  HelpCircle, CheckCircle,
} from 'react-feather';
import { toast } from 'react-toastify';
// import FileUploaderBasic from '@src/components/formComponents/FileUploaderBasic';

// ** Image uploader
import 'react-dropzone-uploader/dist/styles.css';
import Dropzone, {
  IFileWithMeta,
  StatusValue,
} from 'react-dropzone-uploader';
import { acceptedImageFormats } from '@src/configs/dropzoneUploader';

const AccountForm = ({ selectedStore }) => {
  // ** Vars
  const dispatch = useDispatch();
  const storedStoreUsers = useSelector((state) => state.users);

  const {
    register, errors, handleSubmit, setValue, clearErrors, control,
  } = useForm();

  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);
  const [showDropzone, setShowDropzone] = useState(false);

  const [addressObj, setAddressObj] = useState();
  const [storeUsers, setStoreUsers] = useState({});
  const [storeAddress, setStoreAddress] = useState();
  const [storeLogo, setStoreLogo] = useState();

  const handleControlledDropzoneChangeStatus = (status: StatusValue, allFiles: IFileWithMeta[], setFiles: Function) => {
    setTimeout(() => {
      if (['done', 'removed'].includes(status)) {
        setFiles([...allFiles]);
      }
    }, 0);
  };

  useEffect(() => {
    // dispatch(getStoreUsers());
    // setStoreUsers(storedStoreUsers.data.map((obj) => ({ value: obj._id, label: `${obj.firstName} ${obj.lastName}` })));

    // // set defaults
    // const fields = ['storeName', 'storeEmail', 'storePhone', 'storeLogo'];
    // fields.forEach((field) => {
    //   // console.log(field, selectedStore[field]);
    //   setValue(field, selectedStore[field]);
    // });

    // // Set select items
    // setValue('storeUsers', selectedStore.storeUsers.map((item) => ({ label: `${item.firstName} ${item.lastName}`, value: item._id })));

    // // Set the Google Autocomplete
    // setStoreAddress(selectedStore.storeAddress[0].formattedAddress);
    // setStoreLogo(selectedStore.storeLogo);
  }, [selectedStore, dispatch, setStoreUsers, storedStoreUsers.data.length, errors]);

  const onSubmit = async (data) => {
    setProcessing(true);

    if (isObjEmpty(errors)) {
      if (addressObj) {
        data.addressObj = addressObj; // group
      }
      // convert storeUsers into a flat array
      data.storeUsers = data.storeUsers.map((u) => u.value);
      try {
        await dispatch(updateStore(selectedStore._id, data));
        toast.success(
          <>
            <CheckCircle className="mr-1 text-success" />
            Record updated
          </>, {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: true,
          }
        );
        // redirect back to List view
        window.location = `${process.env.REACT_APP_SITE_URL}/vendor/stores`;
        // toggleSidebar();
        setProcessing(false);
      } catch (err) {
        setApiErrors(err.response ? err.response : { data: err.response.data });
      }

      setProcessing(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      { apiErrors.data ? (
        <Alert color="danger">
          <div className="alert-body">
            <span>{`Error: ${apiErrors.data}`}</span>
          </div>
        </Alert>
      ) : <></>}

      <Row>
        <Col md="9" sm="12">
          <Card>
            <CardBody>
              {/* <p><strong>Store Details</strong></p> */}
              <Row>
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label className="form-label" for="storeName">
                      Store Name
                    </Label>
                    <Input
                      type="text"
                      placeholder=""
                      id="storeName"
                      name="storeName"
                      className={classnames({ 'is-invalid': errors.storeName })}
                      innerRef={register({ required: true })}
                    />
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">

                  <FormGroup>
                    <Label className="form-label" for="address">
                      Store Address
                    </Label>
                    <Autocomplete
                      defaultValue={storeAddress}
                      className={`form-control ${classnames({ 'is-invalid': errors.address })}`}
                      apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                      onChange={(e) => setAddressObj()}
                      onPlaceSelected={(place) => {
                        clearErrors('address');
                        setAddressObj(place);
                      }}
                      options={{
                        types: ['address'],
                        componentRestrictions: { country: 'au' },
                      }}
                    />
                    {Object.keys(errors).length && errors.address ? (
                      <small className="text-danger mt-1">{errors.address.message}</small>
                    ) : null}
                  </FormGroup>

                </Col>
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label className="form-label d-flex justify-content-between" for="storeEmail">
                      <span>Store Email</span>
                      <HelpCircle id="tipStoreEmail" size="18px" />
                      <UncontrolledTooltip placement="top" target="tipStoreEmail">
                        Used for order correspondance and reporting
                      </UncontrolledTooltip>
                    </Label>
                    <Input
                      type="email"
                      name="storeEmail"
                      placeholder="jane@example.com"
                      className={classnames({ 'is-invalid': errors.storeEmail })}
                      innerRef={register({
                        required: true,
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: 'Email must be correctly formatted. Please check',
                        },
                      })}
                    />
                    {Object.keys(errors).length && errors.storeEmail ? (
                      <small className="text-danger mt-1">{errors.storeEmail.message}</small>
                    ) : null}
                  </FormGroup>
                </Col>

                <Col md="6" sm="12">
                  <FormGroup>
                    <Label className="form-label" for="storePhone">
                      Store Phone No.
                    </Label>
                    <Input
                      type="text"
                      name="storePhone"
                      placeholder=""
                      className={classnames({ 'is-invalid': errors.storePhone })}
                      innerRef={register({
                        required: true,
                        pattern: {
                          value: /^(?:\+?61|0)[2-478](?:[ -]?[0-9]){8}$/,
                          message: 'Phone number must follow format 0404 123 214 or 03 9874 3777',
                        },
                      })}
                    />
                    {Object.keys(errors).length && errors.storePhone ? (
                      <small className="text-danger mt-1">{errors.storePhone.message}</small>
                    ) : null}
                  </FormGroup>
                </Col>

                <Col md="6" sm="12">
                  <FormGroup>
                    <Label className="form-label" for="storePhone">
                      Store Users
                    </Label>
                    <Controller
                      as={Select}
                      isMulti
                      options={storeUsers}
                      name="storeUsers"
                      isClearable={false}
                      control={control}
                      className={`react-select ${classnames({ 'is-invalid': errors.storeUsers })}`}
                      classNamePrefix="select"
                      rules={{ required: true }}
                    />
                    {Object.keys(errors).length && errors.storeUsers ? (
                      <small className="text-danger mt-1">You must select at least one user</small>
                    ) : null}
                  </FormGroup>
                </Col>

              </Row>

            </CardBody>
          </Card>
        </Col>

        <Col sm="12" lg="3">
          <Card>
            <CardBody>
              <p><strong>Store Logo</strong></p>
              {storeLogo && !showDropzone ? (
                <>
                  <img src={storeLogo} className="img-fluid " alt="logo" />
                  <Button.Ripple onClick={() => setShowDropzone(true)} className="btn-sm float-right" color="flat-info">Change</Button.Ripple>
                </>
              ) : (<></>)}

              {!storeLogo || showDropzone ? (

                <Controller
                  control={control}
                  name="storeLogo"
                  render={({ onChange }) => (
                    <Dropzone
                      accept={acceptedImageFormats}
                      multiple={false}
                      maxFiles={1}
                      maxSizeBytes={(1024 * 1024) * 2} // 2MB
                      inputContent={(files, extra) => (extra.reject ? `Only ${acceptedImageFormats} allowed` : 'Drop image here or click to browse')}
                      styles={{
                        dropzoneReject: { borderColor: '#F19373 !important', backgroundColor: '#F1BDAB' },
                        inputLabel: (files, extra) => (extra.reject ? { color: '#A02800 !important' } : {}),
                      }}
                      onChangeStatus={(file, status, allFiles) => {
                        handleControlledDropzoneChangeStatus(status, allFiles, onChange);
                      }}
                    />
                  )}
                />

              ) : (<></>)}

            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col sm="12">
          <FormGroup className="d-flex">
            <Button.Ripple type="submit" className="mr-1 d-flex" color="primary" disabled={isProcessing}>
              {isProcessing && (
              <div className="d-flex align-items-center mr-1">
                <Spinner color="light" size="sm" />
              </div>
              )}
              <span>Submit</span>
            </Button.Ripple>
            <Button.Ripple outline color="flat-secondary" onClick={() => window.history.back()}>
              Back
            </Button.Ripple>
          </FormGroup>
        </Col>

      </Row>
    </Form>
  );
};
export default AccountForm;
