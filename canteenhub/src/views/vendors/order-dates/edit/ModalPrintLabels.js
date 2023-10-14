/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-no-undef */
import {
  useEffect, useState, useCallback, forwardRef,
} from 'react';

import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';

// ** Store & Actions
import { useDispatch } from 'react-redux';
import { fetchEvent } from '@store/actions/event.actions';

// ** Reactstrap
import {
  Alert, Card, CardBody, FormGroup, Row, Col, Form, Button, Spinner, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import DataTable from 'react-data-table-component';
import Select from 'react-select';
import { useForm } from 'react-hook-form';

// ** Utils
import {
  ChevronDown,
} from 'react-feather';
import UILoader from '@components/ui-loader';
import { columns } from './data';

const ModalPrintLabels = (props) => {
  const dispatch = useDispatch();

  const { selectedEvent } = props;

  const {
    errors, control,
  } = useForm();

  // ** States
  const [orders, setOrderList] = useState(selectedEvent.orders);
  const [subgroupList, setSubgroupList] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const rowSelectCritera = (row) => !row.labelPrinted && row.status !== 'refunded';
  const rowDisabledCriteria = (row) => row.status !== 'active';

  // const menuData = selectedMenu ? selectedMenu.menuData.map((obj, i) => ({ value: i, label: String(Object.keys(obj)) })) : [];
  // const menuData = selectedMenu.menuData.map((obj) => ({ value: obj.catName, label: obj.catName }));

  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  const handleClose = async () => {
    props.modalToggle();
  };

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  // ** Get data on mount
  useEffect(() => {
    setOrderList(selectedEvent.orders);
    const subgroupArray = selectedEvent.orders.map((order) => ({ value: order.profile[0].subgroups[0]._id, label: order.profile[0].subgroups[0].name }));
    const uniqueIds = new Set();
    const unique = subgroupArray.filter((element) => {
      const isDuplicate = uniqueIds.has(element.value);
      uniqueIds.add(element.value);
      return !isDuplicate;
    });
    setSubgroupList(unique);
    //
  }, [selectedEvent.orders]);

  // ** Filter List
  // eslint-disable-next-line consistent-return
  const setCheckboxList = async (value) => {
    await setOrderList(value === null ? selectedEvent.orders : selectedEvent.orders.filter((e) => e.profile[0].subgroups[0]._id === value.value));
  };

  // ** Get data on mount
  // useEffect(() => {
  //   dispatch(getStores());
  //   if (stores) {
  //     setStoreList(stores.data.map((obj) => ({ value: obj._id, label: `${obj.storeName}` })));
  //   }
  // }, [dispatch, setStoreList, stores.data.length]);

  // ** Bootstrap Checkbox Component
  // eslint-disable-next-line react/display-name
  const BootstrapCheckbox = forwardRef(({ onClick, ...rest }, ref) => (
    <div className="custom-control custom-checkbox">
      <input type="checkbox" className="custom-control-input" ref={ref} {...rest} />
      <label className="custom-control-label" onClick={onClick} />
    </div>
  ));

  // const contextActions = React.useMemo(() => {
  const handlePrintLabels = async () => {
    try {
      const orderIds = selectedRows.map((row) => row._id);
      const data = JSON.stringify({
        orderIds,
      });
      axios(`${process.env.REACT_APP_SERVER_URL}/api/orders/printLabels/`, {
        method: 'POST',
        headers,
        responseType: 'blob', // Force to receive data in a Blob Format
        data,
      })
        .then((response) => {
          // Create a Blob from the PDF Stream
          const file = new Blob(
            [response.data],
            { type: 'application/pdf' }
          );
          // Build a URL from the file
          const fileURL = URL.createObjectURL(file);
          // Open the URL on new Window
          window.open(fileURL);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        });

      await dispatch(fetchEvent(selectedEvent._id));
      handleClose();
    } catch (err) {
      // console.log(err);
      setApiErrors(err.response ? err.response : { data: err.response.data });
    }
  };

  return (
    <>

      <Modal isOpen={props.modalVisibility} className="modal-lg">
        <ModalHeader toggle={() => props.modalToggle()}>
          Print labels
        </ModalHeader>
        <Form>
          <ModalBody className="p-0">

            { apiErrors.data ? (
              <Alert color="danger">
                <div className="alert-body">
                  <span>{`Error: ${apiErrors.data}`}</span>
                </div>
              </Alert>
            ) : <></>}

            <Row>
              <Col sm="12">
                <Card className="mb-0">
                  <UILoader blocking={isProcessing}>
                    <CardBody>
                      <Row>
                        <Col sm="12">

                          <Row className="justify-content-end">
                            <Col
                              xl="6"
                            >

                              <FormGroup className="w-100">
                                <Select
                                  as={Select}
                                  options={subgroupList}
                                  name="store"
                                  placeholder="Filter by subgroup"
                              // value={selectedStore}
                                  isClearable
                                  control={control}
                                  className="react-select"
                                  classNamePrefix="select"
                                  onChange={(value) => { setCheckboxList(value); }}
                                />
                              </FormGroup>

                            </Col>
                          </Row>

                          <p>
                            Uncheck the orders that you do not want to print. By default, printed labels are unchecked
                          </p>

                        </Col>
                      </Row>
                      <Row>
                        <Col sm="12">
                          <DataTable
                            noHeader
                            pagination
                            selectableRows
                            columns={columns}
                            paginationPerPage={10}
                            className="react-dataTable"
                            sortIcon={<ChevronDown size={10} />}
                            paginationDefaultPage={currentPage + 1}
                            // paginationComponent={CustomPagination}
                            data={orders}
                            onSelectedRowsChange={handleRowSelected}
                            selectableRowsComponent={BootstrapCheckbox}
                            selectableRowSelected={rowSelectCritera}
                            selectableRowDisabled={rowDisabledCriteria}
                          />
                        </Col>
                      </Row>
                    </CardBody>
                  </UILoader>

                </Card>

              </Col>

            </Row>

          </ModalBody>

          <ModalFooter className="justify-content-start">
            <Row>
              <Col sm="12">

                <FormGroup className="d-flex mt-1">
                  <Button.Ripple className="mr-1 d-flex" color="primary" disabled={isProcessing} onClick={handlePrintLabels}>
                    {isProcessing && (
                    <div className="d-flex align-items-center mr-1">
                      <Spinner color="light" size="sm" />
                    </div>
                    )}
                    <span>Print Labels</span>
                  </Button.Ripple>

                  <Button.Ripple outline color="flat-secondary" onClick={() => handleClose()}>
                    Cancel
                  </Button.Ripple>
                </FormGroup>
              </Col>

            </Row>

          </ModalFooter>
        </Form>
      </Modal>
    </>

  );
};

export default ModalPrintLabels;
