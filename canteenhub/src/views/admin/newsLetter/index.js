/* eslint-disable react/no-danger */
/* eslint-disable import/no-extraneous-dependencies */
import { useEffect, useState } from 'react';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  Button,
  Card, CardBody, Col, Form, Row,
} from 'reactstrap';
import '../../../@core/scss/react/libs/editor/editor.scss';
import { Controller, useForm } from 'react-hook-form';
import {
  CheckCircle,
} from 'react-feather';
import { toast } from 'react-toastify';
import UILoader from '@components/ui-loader';
import { getNewsletter, addUpdateNewsletter } from '@store/actions/newsletter.actions';
import WYSIWYGEditor from './WYSIWYGEditor';

const NewsLetter = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  const newsletter = useSelector((state) => state.newsletter);
  const {
    errors, handleSubmit, control, setValue,
  } = useForm();
  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  useEffect(() => {
    dispatch(getNewsletter());
  }, [dispatch]);

  useEffect(() => {
    if (newsletter.data) {
      // Set select items
      setValue('content', newsletter.data.content);
    }
  }, [newsletter]);

  const onSubmit = async (data) => {
    setProcessing(true);
    try {
      await dispatch(addUpdateNewsletter(data));

      toast.success(
        <>
          <CheckCircle className="mr-1 text-success" />
          Newsletter modified
        </>, {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: true,
        }
      );
      setProcessing(false);
    } catch (err) {
      setApiErrors(err.response ? err.response : { data: err.response.data });
      setProcessing(false);
    }
  };
  return (
    <>
      <div className="table-header">
        <h3>NewsLetter</h3>
      </div>
      <Row>
        <Col md="12" lg="12" sm="12">
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
                  <Controller
                    render={({ value, onChange }) => <WYSIWYGEditor onChange={onChange} value={value} />}
                    name="content"
                    id="content"
                    control={control}
                    defaultValue=""
                    rules={{ required: true }}
                  />
                  {Object.keys(errors).length && errors.content ? (
                    <small className="text-danger mt-1">
                      You must input the content.
                    </small>
                  ) : null}
                </UILoader>
                <div className="my-2">
                  <Button outline size="sm" type="submit" color="primary">
                    Submit
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>

  );
};

export default NewsLetter;
