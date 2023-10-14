const router = require('express').Router();
const mongoose = require('mongoose');

// const { isValidObjectId } = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const ObjectId = require('mongodb').ObjectID;

const verifyUser = require('../utils/verifyToken');
const testModeCheck = require('../utils/testMode');
const { canIAccessRecord } = require('../utils/utils');

// Update Any Record
router.patch('/update/:id', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor']), async (req, res) => {
  const recordId = req.params.id;
  const { recordSource } = req.body;
  const data = req.body;

  delete data.recordSource;

  const canIAccess = await canIAccessRecord(res.user._id, req.params.id, 'createdBy', recordSource);
  if (!canIAccess) { return res.status(400).send('permission error: access denied'); }

  const record = await mongoose.model(recordSource).findOneAndUpdate({ _id: recordId }, data).select('_id');
  return res.send({ record, message: 'Record updated' });
});

module.exports = router;
