/* eslint-disable jsx-a11y/anchor-is-valid */
// ** React Imports
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';
import {
  ChevronDown, Plus,
} from 'react-feather';
import DataTable from 'react-data-table-component';

import {
  Card, Row, Col, Button,
} from 'reactstrap';

import paginationRowsPerPageOptions from '@src/models/constants/paginationRowsPerPageOptions';
import { getMarketPartners } from '@store/actions/market.actions';
import { columns } from './columns';

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss';
import '@styles/react/libs/tables/react-dataTable-component.scss';

const PartnerList = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  const marketPartners = useSelector((state) => state.marketPartners);

  useEffect(() => {
    dispatch(getMarketPartners());
  }, [dispatch, marketPartners.data.length]);

  return (
    <>
      <Row className="table-header">
        <Col>
          <h3>Partner</h3>
          <small>These contents will show on the Landing pages.</small>
        </Col>
        <Col
          xl="4"
          className="text-right"
        >
          <Button.Ripple
            size="sm"
            color="primary"
            tag={Link}
            to="/admin/market/partner/add/"
          >
            <Plus size={14} />
            <span className="align-middle"> Add Partner</span>
          </Button.Ripple>
        </Col>
      </Row>

      <Card>
        <DataTable
          data={marketPartners.data}
          responsive
          className="react-dataTable"
          noHeader
          pagination
          paginationRowsPerPageOptions={paginationRowsPerPageOptions}
          columns={columns()}
          sortIcon={<ChevronDown />}
        />
      </Card>

    </>
  );
};

export default PartnerList;
