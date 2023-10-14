// ** React Import
import { useState, Fragment } from 'react';

// ** Custom Components
import Sidebar from '@components/sidebar';

// ** Utils
import { isObjEmpty } from '@utils';

// ** Third Party Components
import {
  Send,
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
import { inviteGroup } from '@store/actions/group.actions';

const SidebarNewUsers = ({ open, toggleSidebar }) => {
  // ** States
  // const [role, setRole] = useState('subscriber');
  // const [plan, setPlan] = useState('basic');
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
      // values.ability = [
      //   {
      //     action: 'manage',
      //     subject: 'all',
      //   },
      // ];
      values.toRole = 'group';

      try {
        await dispatch(inviteGroup(values));
        toast.success(
          <>
            <Send className="mr-1 text-success" />
            Invite sent!
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
      title="Invite a School"
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

          <small>
            The following will send off an invitation to a school to connect with you on Canteen Hub.
          </small>

          <hr />

          <FormGroup>
            <Label className="form-label" for="toCompanyName">
              School name
            </Label>
            <Input
              type="text"
              placeholder="Enter school name"
              id="toCompanyName"
              name="toCompanyName"
              className={classnames({ 'is-invalid': errors.toCompanyName })}
              innerRef={register({ required: true })}
            />
          </FormGroup>

          <FormGroup>
            <Label className="form-label" for="toFirstName">
              First name
            </Label>
            <Input
              type="text"
              placeholder="Jane"
              id="toFirstName"
              name="toFirstName"
              className={classnames({ 'is-invalid': errors.toFirstName })}
              innerRef={register({ required: true })}
            />
          </FormGroup>

          <FormGroup>
            <Label className="form-label" for="toLastName">
              Last name
            </Label>
            <Input
              type="text"
              placeholder="Doe"
              id="toLastName"
              name="toLastName"
              className={classnames({ 'is-invalid': errors.toLastName })}
              innerRef={register({ required: true })}
            />
          </FormGroup>

          <FormGroup>
            <Label className="form-label" for="email">
              Email
            </Label>
            <Input
              type="email"
              name="toEmail"
              placeholder="jane@example.com"
              className={classnames({ 'is-invalid': errors.toEmail })}
              innerRef={register({
                required: true,
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Email must be correctly formatted. Please check',
                },
              })}
            />
            {Object.keys(errors).length && errors.toEmail ? (
              <small className="text-danger mt-1">{errors.toEmail.message}</small>
            ) : null}
          </FormGroup>
        </div>

        <div className="modal-footer justify-content-start d-flex mt-2">
          <Button type="submit" className="mr-1 d-flex" color="primary" disabled={isProcessing}>
            {isProcessing ? (
              <div className="d-flex align-items-center mr-1">
                <Spinner color="light" size="sm" />
              </div>
            ) : (
              <div className="d-flex align-items-center mr-1">
                <Send className="light" size="15px" />
              </div>
            ) }

            <span>Send Invite</span>
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
