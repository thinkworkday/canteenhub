import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Card, CardBody, Col, FormGroup, Label, Row, Input, Button, Form, Alert,
} from 'reactstrap';

// ** Router Components
import { useForm, Controller } from 'react-hook-form';

// ** Third Party Components
import classnames from 'classnames';

import UILoader from '@components/ui-loader';
import {
  CheckCircle,
} from 'react-feather';
import { toast } from 'react-toastify';

import { updateMarketSchool, getMarketSchool } from '@store/actions/market.actions';

// ** Image uploader
import 'react-dropzone-uploader/dist/styles.css';
import Dropzone, {
  IFileWithMeta,
  StatusValue,
} from 'react-dropzone-uploader';
import { acceptedImageFormats } from '@src/configs/dropzoneUploader';

const MarketSchoolEdit = () => {
  // ** Vars
  const dispatch = useDispatch();
  const { id } = useParams();

  const selectedMarketSchool = useSelector((state) => state.marketSchools.selectedMarketSchool);

  const {
    register, errors, handleSubmit, control, setValue,
  } = useForm();
  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);
  const [selectedPage, setSelectedPage] = useState({ value: '', label: '' });
  const [schoolLogo, setSchoolLogo] = useState();
  const [showDropzone, setShowDropzone] = useState(false);

  useEffect(() => {
    dispatch(getMarketSchool(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedMarketSchool) {
      // set defaults
      const fields = ['schoolName'];
      fields.forEach((field) => {
        setValue(field, selectedMarketSchool[field]);
      });

      // Set select items
      setSchoolLogo(selectedMarketSchool.schoolLogo);
    }
  }, [selectedMarketSchool, errors]);

  const onSubmit = async (data) => {
    setProcessing(true);
    console.log(data);

    try {
      await dispatch(updateMarketSchool(selectedMarketSchool._id, data));

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
      window.location = `${process.env.REACT_APP_SITE_URL}/admin/market/schools`;
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
        <h3>Edit School</h3>
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
                    <Col md="12" sm="12" lg="12">
                      <FormGroup>
                        <Label>
                          School Name
                        </Label>
                        <Input
                          type="text"
                          placeholder=""
                          id="schoolName"
                          name="schoolName"
                          className={classnames({ 'is-invalid': errors.schoolName })}
                          innerRef={register({ required: true })}
                        />
                      </FormGroup>
                      <FormGroup className="mb-4">
                        <Label>
                          School Logo
                        </Label>
                        {schoolLogo && !showDropzone ? (
                          <div className="my-2">
                            <img src={schoolLogo} className="img-fluid" style={{ maxHeight: '250px' }} alt="Content Logo" />
                            <div className="my-2">
                              <Button.Ripple onClick={() => setShowDropzone(true)} className="btn-sm float-left" color="flat-info">Change</Button.Ripple>
                            </div>
                          </div>
                        ) : (<></>)}

                        {!schoolLogo || showDropzone ? (

                          <Controller
                            control={control}
                            id="schoolLogo"
                            name="schoolLogo"
                            rules={{ required: true }}
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
                        {Object.keys(errors).length && errors.schoolLogo ? (
                          <small className="text-danger mt-1">You must drop the school Logo</small>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className="mt-2">
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

export default MarketSchoolEdit;
