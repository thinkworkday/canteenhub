const router = require('express').Router();
const verifyUser = require('../utils/verifyToken');

// ** Models
const MarketContent = require('../model/MarketContent');
const MarketSchool = require('../model/MarketSchool');
const MarketProvide = require('../model/MarketProvide');
const MarketWork = require('../model/MarketWork');
const MarketPartner = require('../model/MarketPartner');
const MarketFeedback = require('../model/MarketFeedback');

// GET Market Contents
router.get('/contents', verifyUser(['admin']), async (req, res) => {
  const totalCount = await MarketContent.countDocuments();
  const contents = await MarketContent.find();
  return res.send({
    totalCount,
    filteredCount: contents.length,
    results: contents,
  });
});

// Create Market Content
router.post('/content/create', verifyUser(['admin']), async (req, res) => {
  const contentData = req.body;
  const checkPageType = await MarketContent.findOne({ pageType: contentData.pageType });
  if (checkPageType) { return res.status(400).send('PageType already exists'); }
  const marketContent = new MarketContent({
    ...contentData,
  });
  try {
    const savedContent = await marketContent.save();

    return res.send({
      content: savedContent,
      message: 'Market Content successfully created',
    });
  } catch (err) {
    if (err.errors.pageType) {
      return res.status(400).send(err.errors.pageType.message);
    }
    return res.status(400).send(err);
  }
});

// GET Market Content
router.get('/content/detail/:id', verifyUser(['admin']), async (req, res) => {
  const contentId = req.params.id;
  const content = await MarketContent.findById(contentId);
  if (!content) {
    return res
      .status(400)
      .send('Content not found or you do not have permission to view');
  }
  return res.send(content);
});

// ** Update Market Content
router.patch('/content/update/:id', verifyUser(['admin']), async (req, res) => {
  const updateValues = req.body;
  try {
    const savedMarketContent = await MarketContent.findOneAndUpdate(
      { _id: req.params.id },
      updateValues,
      {
        new: true,
      },
    );

    return res.send({
      marketContent: savedMarketContent,
      message: 'Market Content successfully updated',
    });
  } catch (err) {
    if (err.errors) {
      return res.status(400).send(err.errors.pageType.message);
    }
    return res.status(400).send(err);
  }
});

// GET Market Provides
router.get('/provides', verifyUser(['admin']), async (req, res) => {
  const totalCount = await MarketProvide.countDocuments();
  const provides = await MarketProvide.find();
  return res.send({
    totalCount,
    filteredCount: provides.length,
    results: provides,
  });
});

// Create Market Provide
router.post('/provide/create', verifyUser(['admin']), async (req, res) => {
  const provideData = req.body;
  const marketProvide = new MarketProvide({
    ...provideData,
  });
  try {
    const savedProvide = await marketProvide.save();

    return res.send({
      provide: savedProvide,
      message: 'Market Provide successfully created',
    });
  } catch (err) {
    return res.status(400).send(err);
  }
});

// GET Market Provide
router.get('/provide/detail/:id', verifyUser(['admin']), async (req, res) => {
  const provideId = req.params.id;
  const provide = await MarketProvide.findById(provideId);
  if (!provide) {
    return res
      .status(400)
      .send('Provide not found or you do not have permission to view');
  }
  return res.send(provide);
});

// ** Update Market Provide
router.patch('/provide/update/:id', verifyUser(['admin']), async (req, res) => {
  const updateValues = req.body;
  try {
    const savedMarketProvide = await MarketProvide.findOneAndUpdate(
      { _id: req.params.id },
      updateValues,
      {
        new: true,
      },
    );
    return res.send({
      marketProvide: savedMarketProvide,
      message: 'Market Provide successfully updated',
    });
  } catch (err) {
    return res.status(400).send(err);
  }
});

// GET Market School
router.get('/schools', verifyUser(['admin']), async (req, res) => {
  const totalCount = await MarketSchool.countDocuments();
  const schools = await MarketSchool.find();
  return res.send({
    totalCount,
    filteredCount: schools.length,
    results: schools,
  });
});

// Create Market Content
router.post('/school/create', verifyUser(['admin']), async (req, res) => {
  const schoolData = req.body;
  const checkSchoolName = await MarketSchool.findOne({ schoolName: schoolData.schoolName });
  if (checkSchoolName) { return res.status(400).send('School Name already exists'); }
  const marketSchool = new MarketSchool({
    ...schoolData,
  });
  try {
    const savedSchool = await marketSchool.save();

    return res.send({
      school: savedSchool,
      message: 'Market School successfully created',
    });
  } catch (err) {
    if (err.errors.schoolName) {
      return res.status(400).send(err.errors.schoolName.message);
    }
    return res.status(400).send(err);
  }
});

// GET Market School
router.get('/school/detail/:id', verifyUser(['admin']), async (req, res) => {
  const schoolId = req.params.id;
  const school = await MarketSchool.findById(schoolId);
  if (!school) {
    return res
      .status(400)
      .send('School not found or you do not have permission to view');
  }
  return res.send(school);
});

// ** Update Market School
router.patch('/school/update/:id', verifyUser(['admin']), async (req, res) => {
  const updateValues = req.body;
  try {
    const savedMarketSchool = await MarketSchool.findOneAndUpdate(
      { _id: req.params.id },
      updateValues,
      {
        new: true,
      }
    );

    return res.send({
      marketSchool: savedMarketSchool,
      message: 'Market School successfully updated'
    });
  } catch (err) {
    if (err.errors) {
      return res.status(400).send(err.errors.schoolName.message);
    }
    return res.status(400).send(err);
  }
});

// GET Market Work
router.get('/works', verifyUser(['admin']), async (req, res) => {
  const totalCount = await MarketWork.countDocuments();
  const works = await MarketWork.find();
  return res.send({
    totalCount,
    filteredCount: works.length,
    results: works,
  });
});

// Create Market Work
router.post('/work/create', verifyUser(['admin']), async (req, res) => {
  const workData = req.body;
  const checkWorkTitle = await MarketWork.findOne({ workTitle: workData.workTitle });
  if (checkWorkTitle) { return res.status(400).send('The Title already exists'); }
  const marketWork = new MarketWork({
    ...workData,
  });
  try {
    const savedWork = await marketWork.save();

    return res.send({
      work: savedWork,
      message: 'Market Work successfully created',
    });
  } catch (err) {
    if (err.errors.workTitle) {
      return res.status(400).send(err.errors.workTitle.message);
    }
    return res.status(400).send(err);
  }
});

// GET Market Work
router.get('/work/detail/:id', verifyUser(['admin']), async (req, res) => {
  const workId = req.params.id;
  const work = await MarketWork.findById(workId);
  if (!work) {
    return res
      .status(400)
      .send('Work not found or you do not have permission to view');
  }
  return res.send(work);
});

// ** Update Market Work
router.patch('/work/update/:id', verifyUser(['admin']), async (req, res) => {
  const updateValues = req.body;
  try {
    const savedMarketWork = await MarketWork.findOneAndUpdate(
      { _id: req.params.id },
      updateValues,
      {
        new: true,
      },
    );

    return res.send({
      marketWork: savedMarketWork,
      message: 'Market Work successfully updated',
    });
  } catch (err) {
    if (err.errors) {
      return res.status(400).send(err.errors.workTitle.message);
    }
    return res.status(400).send(err);
  }
});

// GET Market Partners
router.get('/partners', verifyUser(['admin']), async (req, res) => {
  const totalCount = await MarketPartner.countDocuments();
  const partners = await MarketPartner.find();
  return res.send({
    totalCount,
    filteredCount: partners.length,
    results: partners,
  });
});

// Create Market Content
router.post('/partner/create', verifyUser(['admin']), async (req, res) => {
  const partnerData = req.body;
  const checkTitle = await MarketPartner.findOne({ title: partnerData.title });
  if (checkTitle) { return res.status(400).send('The Title already exists'); }
  const marketPartner = new MarketPartner({
    ...partnerData,
  });
  try {
    const savedPartner = await marketPartner.save();

    return res.send({
      partner: savedPartner,
      message: 'Market Partner successfully created',
    });
  } catch (err) {
    if (err.errors.title) {
      return res.status(400).send(err.errors.title.message);
    }
    return res.status(400).send(err);
  }
});

// GET Market Content
router.get('/partner/detail/:id', verifyUser(['admin']), async (req, res) => {
  const partnerId = req.params.id;
  const partner = await MarketPartner.findById(partnerId);
  if (!partner) {
    return res
      .status(400)
      .send('Content not found or you do not have permission to view');
  }
  return res.send(partner);
});

// ** Update Market Content
router.patch('/partner/update/:id', verifyUser(['admin']), async (req, res) => {
  const updateValues = req.body;
  try {
    const savedMarketPartner = await MarketPartner.findOneAndUpdate(
      { _id: req.params.id },
      updateValues,
      {
        new: true,
      },
    );

    return res.send({
      marketPartner: savedMarketPartner,
      message: 'Market Partner successfully updated',
    });
  } catch (err) {
    if (err.errors) {
      return res.status(400).send(err.errors.title.message);
    }
    return res.status(400).send(err);
  }
});

// GET Market Feedbacks
router.get('/feedbacks', verifyUser(['admin']), async (req, res) => {
  const totalCount = await MarketFeedback.countDocuments();
  const feedbacks = await MarketFeedback.find();
  return res.send({
    totalCount,
    filteredCount: feedbacks.length,
    results: feedbacks,
  });
});

// Create Market Feedback
router.post('/feedback/create', verifyUser(['admin']), async (req, res) => {
  const feedbackData = req.body;
  const checkName = await MarketFeedback.findOne({ name: feedbackData.name });
  if (checkName) { return res.status(400).send('Name already exists'); }
  const marketFeedback = new MarketFeedback({
    ...feedbackData,
  });
  try {
    const savedFeedback = await marketFeedback.save();

    return res.send({
      content: savedFeedback,
      message: 'Market Feedback successfully created',
    });
  } catch (err) {
    if (err.errors.name) {
      return res.status(400).send(err.errors.name.message);
    }
    return res.status(400).send(err);
  }
});

// GET Market Feedback
router.get('/feedback/detail/:id', verifyUser(['admin']), async (req, res) => {
  const feedbackId = req.params.id;
  const feedback = await MarketFeedback.findById(feedbackId);
  if (!feedback) {
    return res
      .status(400)
      .send('Feedback not found or you do not have permission to view');
  }
  return res.send(feedback);
});

// ** Update Market Feedback
router.patch('/feedback/update/:id', verifyUser(['admin']), async (req, res) => {
  const updateValues = req.body;
  try {
    const savedMarketFeedback = await MarketFeedback.findOneAndUpdate(
      { _id: req.params.id },
      updateValues,
      {
        new: true,
      },
    );

    return res.send({
      marketFeedback: savedMarketFeedback,
      message: 'Market Feedback successfully updated',
    });
  } catch (err) {
    if (err.errors) {
      return res.status(400).send(err.errors.name.message);
    }
    return res.status(400).send(err);
  }
});

module.exports = router;
