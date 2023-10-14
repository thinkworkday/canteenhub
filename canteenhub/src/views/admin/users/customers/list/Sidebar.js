// ** React Import
import { useState, Fragment } from 'react';

// ** Custom Components
import Sidebar from '@components/sidebar';

// ** Utils
import { isObjEmpty } from '@utils';

// ** Third Party Components
import {
  CheckCircle,
} from 'react-feather';
import classnames from 'classnames';
import { useForm } from 'react-hook-form';
import {
  Alert, Button, FormGroup, Label, Form, Input, Spinner,
} from 'reactstrap';
import { toast } from 'react-toastify';

// ** Store & Actions
import { useDispatch } from 'react-redux';
// import { AbilityContext } from '@src/utility/context/Can';
import { addAdmin } from '@store/actions/user.actions';

const SidebarNewUsers = ({ open, toggleSidebar }) => {
  // ** States
  // const ability = useContext(AbilityContext);
  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  // ** Store Vars
  const dispatch = useDispatch();

  // ** Vars
  const { register, errors, handleSubmit } = useForm();

  //

  // ** Function to handle form submit
  const onSubmit = async (values) => {
    setProcessing(true);

    if (isObjEmpty(errors)) {
      values.ability = [
        {
          action: 'manage',
          subject: 'all',
        },
      ];
      values.role = 'admin';

      try {
        await dispatch(addAdmin(values));
        toast.success(
          <>
            <CheckCircle className="mr-1 text-success" />
            Admin successfully created
          </>, {
            hideProgressBar: true,
          }
        );
        toggleSidebar();
      } catch (err) {
        setApiErrors(err.response ? err.response : { data: err.response.data });
      }

      setProcessing(false);
    }
  };

  return (
    <Sidebar
      size="lg"
      open={open}
      title="New User"
      headerClassName=""
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
      closeBtn={<></>}
    >
      <Form onSubmit={handleSubmit(onSubmit)} className="h-100 d-flex flex-column ">
        <div className="flex-grow-1">

          { apiErrors.data ? (
            <Alert color="danger">
              <div className="alert-body">
                <span>{`Error: ${apiErrors.data}`}</span>
              </div>
            </Alert>
          ) : <></>}

          <FormGroup>
            <Label className="form-label" for="firstName">
              First name
            </Label>
            <Input
              type="text"
              placeholder="Jane"
              id="firstName"
              name="firstName"
              className={classnames({ 'is-invalid': errors.firstName })}
              innerRef={register({ required: true })}
            />
          </FormGroup>

          <FormGroup>
            <Label className="form-label" for="lastName">
              Last name
            </Label>
            <Input
              type="text"
              placeholder="Doe"
              id="lastName"
              name="lastName"
              className={classnames({ 'is-invalid': errors.lastName })}
              innerRef={register({ required: true })}
            />
          </FormGroup>

          <FormGroup>
            <Label className="form-label" for="email">
              Email
            </Label>
            <Input
              type="email"
              name="email"
              placeholder="jane@example.com"
              className={classnames({ 'is-invalid': errors.email })}
              innerRef={register({
                required: true,
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Email must be correctly formatted. Please check',
                },
              })}
            />
            {Object.keys(errors).length && errors.email ? (
              <small className="text-danger mt-1">{errors.email.message}</small>
            ) : null}
          </FormGroup>
        </div>

        <div className="modal-footer justify-content-start d-flex mt-2">
          <Button type="submit" className="mr-1 d-flex" color="primary" disabled={isProcessing}>
            {isProcessing && (
            <div className="d-flex align-items-center mr-1">
              <Spinner color="light" size="sm" />
            </div>
            )}
            <span>Submit</span>
          </Button>
          <Button type="reset" color="flat-secondary" outline onClick={toggleSidebar}>
            Cancel
          </Button>
        </div>

      </Form>

    </Sidebar>
  );
};

export default SidebarNewUsers;
