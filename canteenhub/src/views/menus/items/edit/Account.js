/* eslint-disable react/jsx-key */
import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useForm, useFieldArray, Controller } from 'react-hook-form';

import {
  Alert, Card, CardBody, FormGroup, Row, Col, Input, Form, Button, Label, Spinner, UncontrolledTooltip, InputGroup, InputGroupText, CustomInput,
} from 'reactstrap';

// ** Utils
import { isObjEmpty, priceFormatterNoCurrency } from '@utils';

// ** Store & Actions
import { getMyMenuItemTags, updateMenuItem } from '@store/actions/menu.actions';

// ** Third Party Components
import CreatableSelect from 'react-select/creatable';

import classnames from 'classnames';
import {
  HelpCircle, Plus, X,
} from 'react-feather';
import { toast } from 'react-toastify';

// ** Image uploader
import 'react-dropzone-uploader/dist/styles.css';
import Dropzone, {
  IFileWithMeta,
  StatusValue,
} from 'react-dropzone-uploader';
import Select from 'react-select';
import { acceptedImageFormats } from '@src/configs/dropzoneUploader';
import currencyOptions from '@src/models/constants/currency';

// Components
import ConfigurableEdit from './ConfigurableEdit';
import BundleEdit from './BundleEdit';

const AccountForm = ({ selectedRecord }) => {
  // ** Vars
  const dispatch = useDispatch();
  const myMenuItemTags = useSelector((state) => state.menus.tags);
  const recordPrices = useMemo(() => selectedRecord.prices.map((price) => ({
    amount: price.amount,
    currency: { value: price.currency, label: price.currency },
    _id: price._id,
  })), [selectedRecord]);

  const {
    register, errors, handleSubmit, setValue, control,
  } = useForm({
    defaultValues: {
      prices: recordPrices,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'prices',
  });

  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);
  const [showDropzone, setShowDropzone] = useState(false);

  const [myTags, setMyTags] = useState([]);
  const [image, setImage] = useState();

  const [type, setType] = useState();

  const handleControlledDropzoneChangeStatus = (status: StatusValue, allFiles: IFileWithMeta[], setFiles: Function) => {
    setTimeout(() => {
      if (['done', 'removed'].includes(status)) {
        setFiles([...allFiles]);
      }
    }, 0);
  };

  // Initiate first load
  useEffect(async () => {
    await setValue('prices', recordPrices);
    fields.forEach((field, index) => {
      setValue(`prices[${index}].currency`, field.currency);
      setValue(`prices[${index}].amount`, field.amount);
    });
  }, [selectedRecord]);

  useEffect(() => {
    // set defaults
    const staticFields = ['name', 'description'];
    staticFields.forEach((field) => {
      setValue(field, selectedRecord[field]);
    });

    setValue('price', priceFormatterNoCurrency(selectedRecord.price ? selectedRecord.price : 0));
    setImage(selectedRecord.image);

    setType(selectedRecord.type);

    // All User Tags
    dispatch(getMyMenuItemTags());

    // If Tags already have values
    setValue('tags', selectedRecord.tags.map((obj) => ({ value: obj, label: obj })));
  }, []);
  // Get user tags
  useEffect(() => {
    if (myMenuItemTags.length > 0) {
      setMyTags(myMenuItemTags.map((obj) => ({ value: obj.tag, label: obj.tag })));
    }
  }, [myMenuItemTags]);

  const submitForm = async (data, closeAndExit = false) => {
    setProcessing(true);
    if (isObjEmpty(errors)) {
      // convert storeUsers into a flat array
      data.tags = data.tags.map((u) => u.value);
      data.type = type;
      try {
        await dispatch(updateMenuItem(selectedRecord._id, data));
        if (closeAndExit) {
          toast.success('Record updated');
          window.location = `${process.env.REACT_APP_SITE_URL}/admin/menu-items/list`;
        }

        setProcessing(false);
      } catch (err) {
        setApiErrors(err.response ? err.response : { data: err.response.data });
      }

      setProcessing(false);
    }
  };

  const onSubmitWithExit = async (data) => {
    if (data.prices && data.prices.length > 0) {
      data.prices.map((price) => {
        price.currency = price.currency.value;
      });
      const encounteredValues = {};
      const duplicates = [];
      data.prices.forEach((price) => {
        const { currency } = price; // Modify this according to your JSON structure
        if (encounteredValues[currency]) {
          duplicates.push(currency);
        } else {
          encounteredValues[currency] = true;
        }
      });
      const uniqueArray = duplicates.filter((value, index, self) => self.indexOf(value) === index);
      if (uniqueArray.length > 0) {
        setApiErrors({ data: `There is duplicated currency ${uniqueArray}.` });
      } else {
        submitForm(data, true);
      }
    } else {
      setApiErrors({ data: 'The price data is not existed.' });
    }
  };

  const onSubmit = async (data) => {
    if (data.prices && data.prices.length > 0) {
      data.prices.map((price) => {
        price.currency = price.currency.value;
      });
      const encounteredValues = {};
      const duplicates = [];
      data.prices.forEach((price) => {
        const { currency } = price;
        if (encounteredValues[currency]) {
          duplicates.push(currency);
        } else {
          encounteredValues[currency] = true;
        }
      });
      const uniqueArray = duplicates.filter((value, index, self) => self.indexOf(value) === index);
      if (uniqueArray.length > 0) {
        setApiErrors({ data: `There is duplicated currency ${uniqueArray}.` });
      } else {
        submitForm(data, true);
      }
    } else {
      setApiErrors({ data: 'The price data is not existed.' });
    }
  };

  const addPrice = () => {
    append({ amount: '', currency: '' });
  };

  return (
    <>
      <Form id="formMenuItemEdit">
        {apiErrors.data ? (
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
                <Row>
                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label className="form-label" for="name">
                        Item Name
                      </Label>
                      <Input
                        type="text"
                        placeholder=""
                        id="name"
                        name="name"
                        className={classnames({ 'is-invalid': errors.name })}
                        innerRef={register({ required: true })}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="form-label d-flex justify-content-between" for="tags">
                        <span>Tags</span>
                        <HelpCircle id="tipTags" size="18px" />
                        <UncontrolledTooltip placement="top" target="tipTags">
                          Use these to help find items when adding to menus. e.g. drinks
                        </UncontrolledTooltip>
                      </Label>
                      <section>
                        <Controller
                          as={CreatableSelect}
                          options={myTags}
                          name="tags"
                          isMulti
                          isClearable={false}
                          control={control}
                          className="react-select"
                          classNamePrefix="select"
                        />
                      </section>
                    </FormGroup>
                    <FormGroup>
                      <Label className="form-label" for="description">
                        Description
                      </Label>
                      <Input
                        type="textarea"
                        placeholder=""
                        id="description"
                        name="description"
                        className={classnames({ 'is-invalid': errors.description })}
                        innerRef={register()}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">
                    <Row>
                      <Col md="5">
                        <FormGroup>
                          <Label className="form-label d-flex justify-content-between" for="price">
                            Price (from)
                            <HelpCircle id="tipPrice" size="18px" />
                            <UncontrolledTooltip placement="top" target="tipPrice">
                              Customers can add further options (e.g. additional ingredients) which will adjust this price
                            </UncontrolledTooltip>
                          </Label>
                        </FormGroup>
                      </Col>
                      <Col md="5">
                        <FormGroup>
                          <Label className="form-label d-flex justify-content-between" for="currency">
                            <span>Currency</span>
                          </Label>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        {fields.map((field, index) => (
                          <div key={field.id}>
                            <Row>
                              <Col md={5} className="d-flex">
                                <FormGroup>
                                  <InputGroup className="custom-input-group">
                                    <InputGroupText>$</InputGroupText>
                                    <Input
                                      type="text"
                                      placeholder="4.00"
                                      id={`prices[${index}].amount`}
                                      name={`prices[${index}].amount`}
                                      className={classnames({ 'is-invalid': errors.prices && errors.prices[index]?.amount })}
                                      innerRef={register({ required: true })}
                                    // onBlur={(e) => { e.target.value = priceFormatter(e.target.value); }}
                                    />
                                  </InputGroup>
                                </FormGroup>
                              </Col>
                              <Col md={5}>
                                <FormGroup>
                                  <Controller
                                    name={`prices[${index}].currency`}
                                    control={control}
                                    defaultValue={null}
                                    rules={{ required: 'This field is required' }}
                                    render={({ onChange, value }) => (
                                      <>
                                        <Select
                                          options={currencyOptions}
                                          name={`prices[${index}].currency`}
                                          value={value || ''}
                                          className={`react-select ${classnames({ 'is-invalid': errors.prices && errors.prices[index]?.currency })}`}
                                          isClearable
                                          onChange={(selected) => onChange(selected)}
                                        />
                                        {(errors.prices && errors.prices[index]?.currency) || (!value && errors.price?.[index]?.currency) ? (
                                          <span className="invalid-feedback">
                                            {errors.prices && errors.prices[index]?.currency?.message}
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  />
                                </FormGroup>
                              </Col>
                              <Col md={2}>
                                <Button.Ripple size="xs" color="danger" className="text-nowrap" onClick={() => remove(index)} outline>
                                  <X size={14} />
                                </Button.Ripple>
                              </Col>
                            </Row>
                          </div>
                        ))}
                        <Button.Ripple size="xs" className="btn-icon" color="danger" outline onClick={addPrice}>
                          <Plus size={14} />
                          <span className="align-middle ml-25">Add Price</span>
                        </Button.Ripple>
                      </Col>
                    </Row>
                  </Col>
                </Row>

              </CardBody>
            </Card>
          </Col>

          <Col sm="12" lg="3">
            <Card>
              <CardBody>
                {image && !showDropzone ? (
                  <>
                    <div className="form-img-wrapper d-flex justify-content-center">
                      <img src={image} className="" alt="img" />
                    </div>
                    <Button.Ripple onClick={() => setShowDropzone(true)} className="btn-sm float-right" color="flat-info">Change</Button.Ripple>
                  </>
                ) : (<></>)}

                {!image || showDropzone ? (
                  <Controller
                    control={control}
                    name="image"
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
      </Form>

      <Row>
        <Col md="9" sm="12">
          <Card>
            <CardBody>
              <CustomInput
                type="switch"
                id="switchItemType"
                name="switchItemType"
                onChange={(e) => {
                  setType(e.target.checked ? 'configurable' : 'item');
                }}
                label="Does this item have options?"
                inline
                // onChange={() => {}}
                checked={type === 'configurable'}
              />

              {type === 'configurable' ? <ConfigurableEdit selectedRecord={selectedRecord} handleSubmit={handleSubmit(onSubmit)} /> : <></>}
              {type === 'bundle' ? <BundleEdit /> : <></>}
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col sm="12">
          <FormGroup className="d-flex">
            <Button.Ripple id="triggerFormSubmit" onClick={handleSubmit(onSubmitWithExit)} className="mr-1 d-flex" color="primary" disabled={isProcessing}>
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

    </>
  );
};
export default AccountForm;
