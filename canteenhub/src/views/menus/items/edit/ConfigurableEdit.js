/* eslint-disable react/jsx-no-undef */
import { useState, useEffect } from 'react';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getMenuItem } from '@store/actions/menu.actions';

// import { getMenu, updateMenu } from '@store/actions/menu.actions';

// ** Reactstrap
import {
  Alert, Row, Col, Button,
} from 'reactstrap';

// ** Third Party Components

// ** Components
import OptionsAccordion from '@src/components/menus/OptionsAccordion';

import ModalExistingOption from '@src/components/modals/ModalAddExistingOption';
import ModalCreateEditOption from '@src/components/modals/ModalCreateEditOption';

const ConfigurableEdit = (props) => {
  const dispatch = useDispatch();
  const selectedRecord = useSelector((state) => state.records.selectedRecord);

  // const { selectedRecord } = props;
  const { id } = useParams();

  const [modalExistingOptionVisibility, setModalExistingOptionVisibility] = useState(false);
  const toggleExistingOptionModal = () => {
    // handleSubmit(); // save record before loading
    setModalExistingOptionVisibility(!modalExistingOptionVisibility);
  };

  const [modalAddOptionVisibility, setModalAddOptionVisibility] = useState(false);
  const toggleAddOptionModal = () => {
    // handleSubmit(); // save record before loading
    setModalAddOptionVisibility(!modalAddOptionVisibility);
  };

  // ** Get data on mount
  useEffect(() => {
    dispatch(getMenuItem(id));
  }, [id]);

  return (
    <>
      <hr />
      <Row className="mt-1">
        <Col sm="12" className="d-flex justify-content-between align-items-center">
          <strong>Options</strong>

          <div>
            <Button.Ripple color="info" outline className="btn-xs mr-1" onClick={() => toggleExistingOptionModal()}>Add Existing Option(s)</Button.Ripple>
            <Button.Ripple color="info" outline className="btn-xs mr-1" onClick={() => toggleAddOptionModal()}>Add New Option</Button.Ripple>
          </div>
        </Col>
      </Row>

      <Row className="mt-1">
        <Col sm="12">
          {selectedRecord.options.length > 0 ? <OptionsAccordion selectedMenuItem={selectedRecord} allowDelete /> : (
            <>
              <Alert color="info">
                <div className="alert-body d-flex justify-content-center align-items-center">
                  This item is set to configurable, but is yet to have options.
                </div>
              </Alert>
              <div className="d-flex justify-content-center align-items-center">
                <Button.Ripple color="info" outline className="btn-xs mr-1" onClick={() => toggleExistingOptionModal()}>Add Existing Option</Button.Ripple>
                <Button.Ripple color="info" outline className="btn-xs ml-1" onClick={() => toggleAddOptionModal()}>Add New Option</Button.Ripple>
              </div>
            </>
          )}
        </Col>
      </Row>

      <ModalExistingOption modalVisibility={modalExistingOptionVisibility} modalToggle={() => toggleExistingOptionModal()} selectedItem={selectedRecord} />
      <ModalCreateEditOption modalVisibility={modalAddOptionVisibility} modalToggle={() => toggleAddOptionModal()} selectedItem={selectedRecord} />
    </>

  );
};

export default ConfigurableEdit;
