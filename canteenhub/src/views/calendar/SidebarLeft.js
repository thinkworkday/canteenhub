// ** React Imports
import { Fragment } from 'react';

// ** Custom Components
// import classnames from 'classnames';
import {
  CardBody, Button, FormGroup,
} from 'reactstrap';
import Select from 'react-select';
import { useForm } from 'react-hook-form';

import { selectEvent } from './store/actions';

const SidebarLeft = (props) => {
  // ** Props
  const {
    handleAddEventSidebar, toggleSidebar, updateFilter, dispatch, storeList,
  } = props;

  // console.log('storeList', storeList);

  const {
    control,
  } = useForm();

  // ** Function to handle Add Event Click
  const handleAddEventClick = () => {
    toggleSidebar(false);
    dispatch(selectEvent({}));
    handleAddEventSidebar();
  };

  return (
    <>
      <div className="sidebar-wrapper">
        <CardBody className="card-body d-flex justify-content-center my-sm-0 mb-3">
          <Button.Ripple color="primary" block onClick={handleAddEventClick}>
            <span className="align-middle">Add Event</span>
          </Button.Ripple>
        </CardBody>
        <CardBody>
          <h5 className="section-label mb-1">
            <span className="align-middle">Filter</span>
          </h5>

          <FormGroup className="w-100">
            <Select
              as={Select}
              options={storeList}
              name="store"
              placeholder="Store"
            // value={selectedStore}
              isClearable
              control={control}
              className="react-select"
              classNamePrefix="select"
              onChange={(e) => { dispatch(updateFilter(e ? { store: e.value } : '')); toggleSidebar(false); }}
            />
          </FormGroup>

          {/* <FormGroup className="w-100">

            <Select
              as={Select}
              options={selectFilters}
              name="status"
              placeholder="Status"
            // value={selectedStore}
              isClearable
              control={control}
              className="react-select"
              classNamePrefix="select"
              onChange={(e) => dispatch(updateFilter(e ? { status: e.value } : ''))}
            />
          </FormGroup> */}

          {/*
          <CustomInput
            type="checkbox"
            className="mb-1"
            label="View All"
            id="view-all"
            checked={store?.selectedCalendars?.length === filters.length}
            onChange={(e) => dispatch(updateAllFilters(e.target.checked))}
          />
          <div className="calendar-events-filter">
            {filters.length
              && filters.map((filter) => (
                <CustomInput
                  type="checkbox"
                  key={filter.label}
                  id={filter.label}
                  label={filter.label}
                  checked={store?.selectedCalendars?.includes(filter.value)}
                  className={classnames({
                    [filter.className]: filter.className,
                  })}
                  onChange={(e) => dispatch(updateFilter(filter.value))}
                />
              ))}
          </div> */}
        </CardBody>
      </div>
      {/* <div className="mt-auto">
        <img className="img-fluid" src={illustration} alt="illustration" />
      </div> */}
    </>
  );
};

export default SidebarLeft;
