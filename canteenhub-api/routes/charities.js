/* eslint-disable no-nested-ternary */
const router = require('express').Router();
const ObjectId = require('mongodb').ObjectID;

const verifyUser = require('../utils/verifyToken');

// ** Models
const Charity = require('../model/Charity');

// ** utils
const { charityValidation } = require('../utils/validation');

// ** Get Charities
router.get('/list', verifyUser(['admin', 'vendor']), async (req, res) => {
  const totalCount = await Charity.countDocuments();
  const charities = await Charity.find({ status: { $ne: 'deleted' } });

  return res.send({
    totalCount,
    filteredCount: charities.length,
    results: charities,
  });
});

// ** Get Charity
router.get('/:id', verifyUser(['admin']), async (req, res) => {
  const charity = await Charity.findOne({ _id: ObjectId(req.params.id) });
  if (!charity) {
    return res
      .status(400)
      .send('Charity not found or you do not have permission to view');
  }
  return res.send(charity);
});

// ** Create Charity
router.post('/create', verifyUser(['admin']), async (req, res) => {
  const data = req.body;

  // validate request
  const { error } = charityValidation(data);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const charity = new Charity({ ...data });

  try {
    const savedCharity = await charity.save();
    return res.send({
      charity: savedCharity,
      message: 'Charity successfully created',
    });
  } catch (err) {
    // console.log(err);
    return res.status(400).send(err);
  }
});

// ** Update Charity
router.patch('/update/:id', verifyUser(['admin']), async (req, res) => {
  const updateValues = req.body;

  try {
    const savedCharity = await Charity.findOneAndUpdate(
      { _id: req.params.id },
      updateValues,
      {
        new: true,
      },
    );

    return res.send({
      charity: savedCharity,
      message: 'Charity successfully updated',
    });
  } catch (err) {
    // console.log(err);
    return res.status(400).send(err);
  }
});

module.exports = router;
