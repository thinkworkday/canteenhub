/* eslint-disable react/jsx-key */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';

// ** Utils
import { isObjEmpty, getLoggedUser } from '@utils';
import classnames from 'classnames';
import moment from 'moment';

// ** Store & Actions
import { addMenu, getMenus, getMenu } from '@store/actions/menu.actions';

// ** Third Party Components
import {
  Alert, Card, CardBody, FormGroup, Row, Col, Input, Form, Button, Label, Spinner, UncontrolledTooltip,
} from 'reactstrap';

import Select from 'react-select';

import {
  HelpCircle,
} from 'react-feather';
import { toast } from 'react-toastify';
import UILoader from '@components/ui-loader';
import { store } from '@src/redux/storeConfig/store';

const AddMenuVariationForm = () => {
  // ** Vars
  const dispatch = useDispatch();
  const menus = useSelector((state) => state.menus.data);

  const {
    register, errors, handleSubmit, setValue, clearErrors, control,
  } = useForm();
  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  const [defaultMenus, setDefaultMenus] = useState({});

  const loggedUser = getLoggedUser();

  // ** Get data on mount
  useEffect(() => {
    dispatch(getMenus());
    if (menus.length > 0) {
      setDefaultMenus(menus.map((menu) => (!menu.menuParent ? { value: menu._id, label: `${menu.name}` } : null)).filter((x) => x != null));
    }
  }, [menus.length]);

  const onSubmit = async (data) => {
    setProcessing(true);

    if (isObjEmpty(errors)) {
      // set vendor to current user (logged in as vendor) - if admin then need to manually specify
      try {
        // copy menu to another record (as variation)
        const parentMenu = await axios
          .get(`${process.env.REACT_APP_SERVER_URL}/api/menus/${data.defaultMenu.value}/true`, {
            headers,
          })
          .then((response) => response.data)
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.log(error);
          });

        const variationMenu = {
          name: `${parentMenu.name} [VAR ${moment()}]`,
          description: parentMenu.description,
          menuParent: data.defaultMenu.value,
          menuData: parentMenu.menuData,
          vendors: [loggedUser._id],
        };

        await dispatch(addMenu(variationMenu));
        const createdMenu = store.getState().menus.selectedMenu;
        toast.success('Menu created');
        // redirect back to List view
        window.location = `${process.env.REACT_APP_SITE_URL}/${loggedUser.role}/menus/edit/${createdMenu._id}`;
        setProcessing(false);
      } catch (err) {
        if (err.response && err.response.status === 500) {
          setApiErrors({ data: 'Could not upload image. File format error' });
        } else {
          // setApiErrors(err.response ? err.response : { data: err.response.data });
        }
        setProcessing(false);
      }
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
            <UILoader blocking={isProcessing}>
              <CardBody>
                {/* <p><strong>Store Details</strong></p> */}
                <Row>

                  <Col md="6">
                    <FormGroup>
                      <Label className="form-label d-flex justify-content-between" for="tags">
                        <span>Create from*</span>
                        <HelpCircle id="tipTags" size="18px" />
                        <UncontrolledTooltip placement="top" target="tipTags">
                          You can create variations of menus from Default (admin created) menus only
                        </UncontrolledTooltip>
                      </Label>
                      <section>
                        <Controller
                          as={Select}
                          options={defaultMenus}
                          name="defaultMenu"
                          isClearable={false}
                          control={control}
                          rules={{ required: true }}
                          className={`react-select ${classnames({ 'is-invalid': errors.defaultMenus })}`}
                          classNamePrefix="select"
                        />
                      </section>
                    </FormGroup>
                  </Col>
                </Row>

                {/* <Row>
                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label className="form-label" for="name">
                        Name*
                      </Label>
                      <Input
                        type="text"
                        placeholder="e.g. My Restaurant Menu"
                        id="name"
                        name="name"
                        className={classnames({ 'is-invalid': errors.name })}
                        innerRef={register({ required: true })}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">

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
                </Row> */}
              </CardBody>
            </UILoader>

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
export default AddMenuVariationForm;
