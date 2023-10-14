/* eslint-disable eqeqeq */
/* eslint-disable no-return-assign */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Card, CardBody, Col, FormGroup, Label, Row, Input, Button, Form, Alert,
} from 'reactstrap';
import Select from 'react-select';

// ** Router Components
import { useForm, Controller } from 'react-hook-form';

// ** Third Party Components
import classnames from 'classnames';

import UILoader from '@components/ui-loader';
import {
  CheckCircle,
} from 'react-feather';
import { toast } from 'react-toastify';

import { updateMarketContent, getMarketContent } from '@store/actions/market.actions';
// ** Image uploader
import 'react-dropzone-uploader/dist/styles.css';
import Dropzone, {
  IFileWithMeta,
  StatusValue,
} from 'react-dropzone-uploader';
import { acceptedImageFormats } from '@src/configs/dropzoneUploader';

const MarketContentEdit = () => {
  // ** Vars
  const dispatch = useDispatch();
  const { id } = useParams();

  const selectedMarketContent = useSelector((state) => state.marketContents.selectedMarketContent);

  const {
    register, errors, handleSubmit, control, setValue,
  } = useForm();
  const [apiErrors, setApiErrors] = useState({});
  const [contentLogo, setContentLogo] = useState();
  const [isProcessing, setProcessing] = useState(false);
  const [showDropzone, setShowDropzone] = useState(false);
  const [selectedPage, setSelectedPage] = useState({ value: '', label: '' });

  const [pageTypeList, setPageTypeList] = useState([
    { value: 'land', label: 'For Land' },
    { value: 'parents', label: 'Parents / Care givers' },
    { value: 'schools', label: 'For Schools' },
    { value: 'store', label: 'For Store' },
  ]);

  useEffect(() => {
    dispatch(getMarketContent(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedMarketContent) {
      // set defaults
      const fields = ['title', 'subTitle', 'content'];
      fields.forEach((field) => {
        setValue(field, selectedMarketContent[field]);
      });

      // Set select items
      setValue('pageType', pageTypeList.filter((item) => item.value == selectedMarketContent.pageType)[0]);
      setContentLogo(selectedMarketContent.contentLogo);
    }
  }, [selectedMarketContent, errors]);

  const onSubmit = async (data) => {
    setProcessing(true);

    data.pageType = data.pageType.value;
    console.log(data);

    try {
      await dispatch(updateMarketContent(selectedMarketContent._id, data));

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
      window.location = `${process.env.REACT_APP_SITE_URL}/admin/market/contents`;
      setProcessing(false);
    } catch (err) {
      if (err.response && err.response.status === 500) {
        setApiErrors({ data: 'Could not upload image. File format error' });
      } else {
        setApiErrors(err.response ? err.response : { data: err.response.data });
      }
      setProcessing(false);
    }
  };

  const handleControlledDropzoneChangeStatus = (status: StatusValue, allFiles: IFileWithMeta[], setFiles: Function) => {
    setTimeout(() => {
      if (['done', 'removed'].includes(status)) {
        setFiles([...allFiles]);
      }
    }, 0);
  };

  const handlePageChange = (selectedOption) => {
    setSelectedPage(selectedOption);
  };

  return (
    <div>
      <div className="table-header">
        <Button.Ripple color="flat-light" onClick={() => window.history.back()}>
          &lt; back to list
        </Button.Ripple>
        <h3>Edit Content</h3>
      </div>
      <Row>
        <Col md="9" sm="12" lg="9">
          <Card>
            <CardBody>
              <Form onSubmit={handleSubmit(onSubmit)}>
                {apiErrors.data ? (
                  <Alert color="danger">
                    <div className="alert-body">
                      <span>{`Error: ${apiErrors.data}`}</span>
                    </div>
                  </Alert>
                ) : <></>}
                <UILoader blocking={isProcessing}>
                  <Row>
                    <Col md="8" sm="12" lg="8">
                      <FormGroup>
                        <Label>
                          Page
                        </Label>
                        <Controller
                          as={Select}
                          options={pageTypeList}
                          id="pageType"
                          name="pageType"
                          isClearable={false}
                          control={control}
                          rules={{ required: true }}
                          className={`react-select ${classnames({ 'is-invalid': errors.pageType })}`}
                          classNamePrefix="select"
                          onChange={handlePageChange}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>
                          Title
                        </Label>
                        <Input
                          type="text"
                          placeholder=""
                          id="title"
                          name="title"
                          className={classnames({ 'is-invalid': errors.title })}
                          innerRef={register({ required: true })}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>
                          Sub Title
                        </Label>
                        <Input
                          type="text"
                          placeholder=""
                          id="subTitle"
                          name="subTitle"
                          className={classnames({ 'is-invalid': errors.subTitle })}
                          innerRef={register()}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>
                          Content
                        </Label>
                        <Input
                          type="textarea"
                          placeholder=""
                          id="content"
                          name="content"
                          rows={5}
                          className={classnames({ 'is-invalid': errors.content })}
                          innerRef={register({ required: true })}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="4" sm="12" lg="4">
                      <FormGroup>
                        <Label>
                          Content Logo
                        </Label>
                        {contentLogo && !showDropzone ? (
                          <div>
                            <img src={contentLogo} className="img-fluid" style={{ maxHeight: '250px' }} alt="Content Logo" />
                            <div>
                              <Button.Ripple onClick={() => setShowDropzone(true)} className="btn-sm float-left" color="flat-info">Change</Button.Ripple>
                            </div>
                          </div>
                        ) : (<></>)}

                        {!contentLogo || showDropzone ? (

                          <Controller
                            control={control}
                            name="contentLogo"
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
                      </FormGroup>
                    </Col>
                  </Row>
                  <div>
                    <Button outline size="sm" type="submit" color="primary">
                      Save
                    </Button>
                  </div>
                </UILoader>
              </Form>
            </CardBody>
          </Card>
        </Col>

      </Row>
    </div>
  );
};

export default MarketContentEdit;
