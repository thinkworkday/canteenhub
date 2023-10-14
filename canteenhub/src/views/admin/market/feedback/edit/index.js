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

import { updateMarketFeedback, getMarketFeedback } from '@store/actions/market.actions';

const MarketFeedbackEdit = () => {
  // ** Vars
  const dispatch = useDispatch();
  const { id } = useParams();

  const selectedMarketFeedback = useSelector((state) => state.marketFeedbacks.selectedMarketFeedback);

  const {
    register, errors, handleSubmit, control, setValue,
  } = useForm();
  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  useEffect(() => {
    dispatch(getMarketFeedback(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedMarketFeedback) {
      // set defaults
      const fields = ['name', 'content'];
      fields.forEach((field) => {
        setValue(field, selectedMarketFeedback[field]);
      });
    }
  }, [selectedMarketFeedback]);

  const onSubmit = async (data) => {
    setProcessing(true);

    try {
      await dispatch(updateMarketFeedback(selectedMarketFeedback._id, data));

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
      window.location = `${process.env.REACT_APP_SITE_URL}/admin/market/feedbacks`;
      setProcessing(false);
    } catch (err) {
      setApiErrors(err.response ? err.response : { data: err.response.data });
      setProcessing(false);
    }
  };

  return (
    <div>
      <div className="table-header">
        <Button.Ripple color="flat-light" onClick={() => window.history.back()}>
          &lt; back to list
        </Button.Ripple>
        <h3>Edit Feedback</h3>
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
                          Name
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

export default MarketFeedbackEdit;
