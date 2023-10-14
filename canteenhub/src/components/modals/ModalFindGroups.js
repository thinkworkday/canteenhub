/* eslint-disable react/jsx-no-undef */
import { useState } from 'react';

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux';
import { findGroupsByPostcode, findGroupsBySchoolName } from '@store/actions/group.actions';
import { updateProfile, getProfile } from '@store/actions/customer.actions';

// ** Reactstrap
// import Avatar from '@components/avatar';
import {
  Alert, Button, Badge, Media, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Spinner, Input, CustomInput,
} from 'reactstrap';

// ** Third Party Components
import Autocomplete from 'react-google-autocomplete';
import { toast } from 'react-toastify';

// import { Search } from 'react-feather';

const ModalFindGroups = (props) => {
  const dispatch = useDispatch();
  const { profile, setSubGroupSelected } = props;
  const groupsFound = useSelector((state) => state.groups?.data);
  const [searchStarted, setSearchStarted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isDirectSearching, setIsDirectSearching] = useState(false);
  const [groupSelected, setGroupSelected] = useState(false);
  const [directed, setDirected] = useState(false);
  // const [subGroupSelected, setSubGroupSelected] = useState(false);

  const findGroupsByPlace = async (place) => {
    const addressComponents = place.address_components;
    const addressPostcode = addressComponents.map((obj) => ((obj.types[0] === 'postal_code') ? obj.long_name : null)).filter((x) => x != null);
    setIsSearching(true);
    await dispatch(findGroupsByPostcode(addressPostcode[0]));
    setIsSearching(false);
    setSearchStarted(true);
  };

  const findGroupsByName = async (schoolName) => {
    if (schoolName === '') {
      schoolName = 'empty-school-name';
    }
    setIsDirectSearching(true);
    await dispatch(findGroupsBySchoolName(schoolName));
    setIsDirectSearching(false);
    setSearchStarted(true);
  };

  const handleGroupSelect = (groupObj) => {
    setGroupSelected(groupObj);
  };

  const handleRefresh = async () => {
    setIsSearching(false);
    setGroupSelected(false);
  };

  const handleClose = async () => {
    props.modalToggle();
  };

  const handleSearchMode = (value) => {
    dispatch({
      type: 'GET_GROUPS',
      data: [],
    });
    setSearchStarted(false);
    setDirected(value);
    setIsSearching(false);
    setIsDirectSearching(false);
    setGroupSelected(false);
  };

  const handleSubgroupSelect = async (subgroupObj, profileObj) => {
    try {
      if (profileObj) {
        await dispatch(updateProfile(profileObj._id, { subgroups: [subgroupObj._id] }));
        toast.success('Profile assigned');
        dispatch(getProfile(profileObj._id));
      } else {
        // console.log('group', groupSelected.group._id);
        // console.log('subgroup', subgroupObj._id);
        setSubGroupSelected({ group: groupSelected, subgroup: subgroupObj });
      }
      handleClose();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  };

  const SearchResults = () => {
    const searchRows = groupsFound.map((obj, i) => (
      <div role="button" tabIndex={i} key={i} className="btn-row d-flex justify-content-md-between align-items-center" onClick={() => handleGroupSelect(obj)} onKeyDown={() => handleGroupSelect(obj)}>
        <Media>
          <Media body>
            <h6 className="transaction-title mb-0">{obj.group.companyName}</h6>
            <small>{obj.group.address[0].formattedAddress}</small>
          </Media>
        </Media>
        <small className="text-success">
          {Math.ceil(obj.distance)}
          km
        </small>
      </div>
    ));
    return (searchStarted ? (
      <>
        <p className="text-info mt-2 text-center">
          <small>
            {groupsFound.length}
            {' '}
            results found within 25km
          </small>
        </p>
        {searchRows}
      </>
    ) : <></>);
  };

  const DirectSearchResults = () => {
    const searchRows = groupsFound.map((obj, i) => (
      <div role="button" tabIndex={i} key={i} className="btn-row d-flex justify-content-md-between align-items-center" onClick={() => handleGroupSelect(obj)} onKeyDown={() => handleGroupSelect(obj)}>
        <Media>
          <Media body>
            <h6 className="transaction-title mb-0">{obj.group.companyName}</h6>
            <small>{obj.group.address[0].formattedAddress}</small>
          </Media>
        </Media>
      </div>
    ));
    return (searchStarted ? (
      <>
        <p className="text-info mt-2 text-center">
          <small>
            {groupsFound.length}
            {' '}
            results found.
          </small>
        </p>
        {searchRows}
      </>
    ) : <></>);
  };

  const SelectSubgroup = (props) => {
    const { subgroups } = props.group;
    const { profile } = props;

    if (!subgroups || subgroups.length <= 0) {
      return (
        <Alert color="primary">
          <div className="alert-body">
            <span>Oooops.... No classrooms found</span>
            <br />
            <span>
              Please contact
              {' '}
              <strong>{props.group.email}</strong>
            </span>
          </div>
        </Alert>
      );
    }

    const subgroupRows = subgroups.map((subgroup, i) => (
      <div role="button" tabIndex={i} key={i} className="btn-row d-flex justify-content-md-between align-items-center" onClick={() => handleSubgroupSelect(subgroup, profile)} onKeyDown={() => handleSubgroupSelect(subgroup, profile)}>
        <Media>
          <Media body>
            <p className="transaction-title mb-0">{subgroup.name}</p>
            <small>{subgroup.description}</small>
          </Media>
        </Media>

        <Badge color="light-success">
          {subgroup.type}
        </Badge>
      </div>
    ));
    return (
      <>
        {subgroupRows}
      </>
    );
  };

  return (
    <>

      <Modal isOpen={props.modalVisibility}>
        <ModalHeader toggle={() => props.modalToggle()}>
          {groupSelected ? 'Select a classroom' : 'Assign profile to a school'}
        </ModalHeader>
        <ModalBody>
          <CustomInput
            className="pb-1"
            type="switch"
            id="searchMode"
            name="searchMode"
            onChange={(e) => handleSearchMode(e.target.checked)}
            label="Search Mode"
            inline
            checked={directed}
          />
          {!groupSelected ? (
            <>
              {!directed ? (
                <>
                  <FormGroup>
                    <Label for="address-2">Find your school by Suburb or Postcode</Label>
                    <Autocomplete
                      placeholder="Enter suburb or postcode"
                      className="form-control"
                      apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                      // onChange={(e) => setAddressObj()}
                      onPlaceSelected={(place) => {
                        if (place.address_components) {
                          findGroupsByPlace(place);
                        } else {
                          // eslint-disable-next-line no-alert
                          alert('Please select a location from the list');
                        }
                      }}
                      options={{
                        types: ['(regions)'],
                        componentRestrictions: { country: 'au' },
                      }}
                    />
                  </FormGroup>

                  {isSearching ? (
                    <div className="text-center my-3">
                      <Spinner color="primary" size="md" />
                      <small className="d-block mt-1">Finding nearest schools...</small>
                    </div>
                  ) : <SearchResults className="mt-2" />}
                </>
              ) : (
                <>
                  <FormGroup>
                    <Label for="address-2">Find your school by school name</Label>
                    <Input
                      type="text"
                      placeholder="School Name"
                      id="schoolName"
                      name="schoolName"
                      autoComplete="off"
                      onChange={(e) => {
                        findGroupsByName(e.target.value);
                      }}
                    />
                  </FormGroup>

                  {isDirectSearching ? (
                    <div className="text-center my-3">
                      <Spinner color="primary" size="md" />
                      <small className="d-block mt-1">Finding schools...</small>
                    </div>
                  ) : <DirectSearchResults className="mt-2" />}
                </>
              )}

              {/* {searchStarted ? (
                <>
                  {groupsFound && groupsFound.length > 0 ? () : (
                    <Alert color="primary">
                      <div className="alert-body">
                        <span>No schools found based on your search location</span>
                      </div>
                    </Alert>
                  )}
                </>
              ) : <></>} */}

            </>

          ) : (<SelectSubgroup group={groupSelected.group} profile={profile} />)}

        </ModalBody>

        {groupSelected ? (
          <ModalFooter className="justify-content-start">
            <Button.Ripple onClick={() => handleRefresh()} color="flat-secondary" size="xs">
              &lt; back
            </Button.Ripple>
          </ModalFooter>
        ) : (<></>)}

      </Modal>
    </>

  );
};

export default ModalFindGroups;
