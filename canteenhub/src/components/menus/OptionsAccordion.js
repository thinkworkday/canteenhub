import { useState } from 'react';

// ** Reactstrap
import {
  UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, ListGroup, ListGroupItem,
} from 'reactstrap';

// ** Third Party Components
import Collapsible from 'react-collapsible';
import {
  Layers, MoreVertical, ChevronDown, ChevronUp, X,
} from 'react-feather';

// ** Components
import ModalRemoveOptionFromItem from '@src/components/modals/ModalRemoveOptionFromItem';
import ModalSortOptionInItem from '@src/components/modals/ModalSortOptionInItem';

const OptionsAccordion = (props) => {
  const { selectedMenu, selectedMenuItem, allowDelete } = props;

  const unavailableMenuOptions = selectedMenu && selectedMenu.menuOptionModifications[0] && selectedMenu.menuOptionModifications[0].unavailableMenuOptions ? selectedMenu.menuOptionModifications[0].unavailableMenuOptions : {};

  const [modalSortOptionVisibility, setModalSortOptionVisibility] = useState(false);
  const toggleSortOptionModal = () => { setModalSortOptionVisibility(!modalSortOptionVisibility); };

  const [modalRemoveOptionVisibility, setModalRemoveOptionVisibility] = useState(false);
  const [selectedOptionGroup, setSelectedOptionGroup] = useState([]);

  const toggleRemoveOptionModal = (optionGroup) => {
    setSelectedOptionGroup(optionGroup);
    setModalRemoveOptionVisibility(!modalRemoveOptionVisibility);
  };

  const renderTrigger = (optionGroup, unavailableMenuOptions) => {
    const unavailableCount = unavailableMenuOptions && unavailableMenuOptions.length > 0 && optionGroup.options ? optionGroup.options.map((option) => (!!unavailableMenuOptions.includes(option.id))).filter(Boolean).length : 0;

    return (
      <div className="trigger-wrapper d-flex align-items-center justify-content-between">
        <p className="m-0 ">
          {optionGroup.name}
          <small className="text-muted">
            {` (${optionGroup.options.length} options)`}
          </small>
          {unavailableCount > 0 ? (
            <small className="text-danger">
              {`  ${unavailableCount} unavailable`}
            </small>
          ) : '' }
        </p>
        <div>
          <span className="chevron-down"><ChevronDown size={18} /></span>
          <span className="chevron-up"><ChevronUp size={18} /></span>
        </div>
      </div>
    );
  };

  return (
    <>
      { selectedMenuItem.options.map((optionGroup, i) => (
        <Collapsible
          key={`optionGroup-${i}`}
          trigger={renderTrigger(optionGroup, unavailableMenuOptions)}
          triggerSibling={() => (
            <div className="Collapsible__action">
              <UncontrolledButtonDropdown>
                <DropdownToggle tag="div" className="btn btn-sm">
                  <MoreVertical size={14} className="cursor-pointer action-btn" />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem href="#" tag="a" onClick={() => toggleSortOptionModal()}>
                    <Layers size="16" />
                    {' '}
                    Change position
                    {' '}
                  </DropdownItem>
                  {allowDelete ? (
                    <DropdownItem href="#" tag="a" onClick={() => toggleRemoveOptionModal(optionGroup)}>
                      <X />
                      {' '}
                      Remove Option
                    </DropdownItem>
                  ) : ''}
                </DropdownMenu>
              </UncontrolledButtonDropdown>
            </div>
          )}
        >
          <ListGroup>
            { optionGroup.options.map((option, i) => (
              <ListGroupItem key={`option-${i}`} className={unavailableMenuOptions && unavailableMenuOptions.length > 0 && unavailableMenuOptions.includes(option.id) ? 'unavailable' : ''}>
                {`${option.name} `}
                {option.price ? (
                  <small className="text-primary">
                    (+$
                    {option.price}
                    )
                  </small>
                ) : <></> }

              </ListGroupItem>
            ))}
          </ListGroup>
        </Collapsible>
      ))}

      <ModalSortOptionInItem modalVisibility={modalSortOptionVisibility} modalToggle={() => toggleSortOptionModal()} selectedRecord={selectedMenuItem} />
      <ModalRemoveOptionFromItem modalVisibility={modalRemoveOptionVisibility} modalToggle={() => toggleRemoveOptionModal()} selectedRecord={selectedMenuItem} selectedOptionGroup={selectedOptionGroup} />
    </>
  );
};

export default OptionsAccordion;
