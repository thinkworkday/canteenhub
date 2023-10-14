import { useState } from 'react';
import { useDispatch } from 'react-redux';
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

import { addMarketProvide } from '@store/actions/market.actions';

// ** Image uploader
import 'react-dropzone-uploader/dist/styles.css';
import Dropzone, {
  IFileWithMeta,
  StatusValue,
} from 'react-dropzone-uploader';
import { acceptedImageFormats } from '@src/configs/dropzoneUploader';

const MarketProvideAdd = () => {
  // ** Vars
  const dispatch = useDispatch();

  const {
    register, errors, handleSubmit, control,
  } = useForm();
  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  const onSubmit = async (data) => {
    setProcessing(true);

    try {
      await dispatch(addMarketProvide(data));

      toast.success(
        <>
          <CheckCircle className="mr-1 text-success" />
          Market Provide added
        </>, {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: true,
        }
      );

      // redirect back to List view
      window.location = `${process.env.REACT_APP_SITE_URL}/admin/market/provides`;
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

  return (
    <div>
      <div className="table-header">
        <Button.Ripple color="flat-light" onClick={() => window.history.back()}>
          &lt; back to list
        </Button.Ripple>
        <h3>Add Provide</h3>
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
                      <FormGroup>
                        <Label>
                          Provide Logo
                        </Label>
                        <Controller
                          control={control}
                          id="provideLogo"
                          name="provideLogo"
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
                        {Object.keys(errors).length && errors.provideLogo ? (
                          <small className="text-danger mt-1">You must drop the provide Logo</small>
                        ) : null}
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

export default MarketProvideAdd;
