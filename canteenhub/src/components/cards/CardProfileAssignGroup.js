/* eslint-disable react/jsx-key */
import { useState } from 'react';

// ** Components
import {
  Alert, Button, FormGroup, Label,
} from 'reactstrap';

import ModalFindGroups from '@src/components/modals/ModalFindGroups';

// ** Third Party Components
// import { updateProfile, getProfile } from '@store/actions/customer.actions';

const CardProfileAssignGroup = (props) => {
  const { profile, subGroupSelected, setSubGroupSelected } = props;
  const [modalVisibility, setModalVisibility] = useState(false);
  const toggleModal = () => {
    setModalVisibility(!modalVisibility);
  };

  const renderAssignGroups = (groupDataSelected) => {
    const { group } = groupDataSelected.group;
    const { subgroup } = groupDataSelected;

    return (
      <div key={subgroup._id} className="btn-row bg-white d-flex justify-content-between align-items-center ">
        <div className="media">
          <div className="media-body">
            <h6 className="transaction-title mb-0">{group ? group.companyName : ''}</h6>
            <small>
              {subgroup.description ? `${subgroup.description} - ` : ''}
              {subgroup.name}
            </small>
          </div>
        </div>

        <div className="d-flex align-items-center ">
          <Button.Ripple size="xs" color="primary" outline onClick={() => setModalVisibility(!modalVisibility)}>
            edit
          </Button.Ripple>
        </div>

      </div>
    );
  };

  return (

    <FormGroup>
      <Label className="form-label" for="school">
        School
      </Label>
      { profile && profile.subgroups && profile.subgroups.length > 0 ? renderAssignGroups(profile.subgroups) : (
        <>
          {subGroupSelected && subGroupSelected.subgroup ? renderAssignGroups(subGroupSelected) : (
            <>
              <Alert color="primary">
                <div className="alert-body">
                  No assigned school. Please assign in order to place orders for this profile.
                </div>
              </Alert>
              <Button color="primary" size="xs" onClick={() => toggleModal()} outline>
                Assign School
              </Button>
            </>
          )}
        </>
      )}

      <ModalFindGroups
        modalVisibility={modalVisibility}
        modalToggle={() => toggleModal()}
        profile={profile}
        subGroupSelected={subGroupSelected}
        setSubGroupSelected={setSubGroupSelected}
      />

    </FormGroup>

  );
};

export default CardProfileAssignGroup;
