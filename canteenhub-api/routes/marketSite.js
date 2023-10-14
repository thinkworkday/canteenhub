const router = require('express').Router();

// ** Models
const MarketContent = require('../model/MarketContent');
const MarketPartner = require('../model/MarketPartner');
const MarketProvide = require('../model/MarketProvide');
const MarketSchool = require('../model/MarketSchool');
const MarketWork = require('../model/MarketWork');
const MarketFeedback = require('../model/MarketFeedback');

// GET Market Schools
router.get('/schools', async (req, res) => {
  const schools = await MarketSchool.find();
  return res.send({
    results: schools,
  });
});

// GET Market Works
router.get('/works', async (req, res) => {
  const works = await MarketWork.find();
  return res.send({
    results: works,
  });
});

// GET Market Provides
router.get('/provides', async (req, res) => {
  const provides = await MarketProvide.find();
  return res.send({
    results: provides,
  });
});

// GET Market Content 
router.get('/content', async (req, res) => {
  const content = await MarketContent.findOne({ pageType: req.query.pageType });
  return res.send({
    result: content,
  });
});

// GET Market Partners
router.get('/partners', async (req, res) => {
  const partners = await MarketPartner.find();
  return res.send({
    results: partners,
  });
});

// GET Market Feedbacks
router.get('/feedbacks', async (req, res) => {
  const feedbacks = await MarketFeedback.find();
  return res.send({
    results: feedbacks,
  });
});

module.exports = router;
