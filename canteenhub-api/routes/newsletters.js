const router = require('express').Router();

// ** Models
const Newsletter = require('../model/Newsletter');
const verifyUser = require('../utils/verifyToken');

// GET Newsletter
router.get('/', verifyUser(['admin']), async (req, res) => {
  const newsletter = await Newsletter.find();
  return res.send({
    result: newsletter[0],
  });
});

// GET Newsletter View
router.get('/view', async (req, res) => {
  const newsletter = await Newsletter.find();
  return res.send({
    result: newsletter[0],
  });
});

// Create Or Update Newsletter
router.post('/createOrUpdate', verifyUser(['admin']), async (req, res) => {
  const newsletterData = req.body;
  const newsletters = await Newsletter.find();
  if (newsletters.length == 0) { 
    const newsletter = new Newsletter({
      ...newsletterData,
    });
    try {
      const savedNewsletter = await newsletter.save();
  
      return res.send({
        content: savedNewsletter,
        message: 'Newsletter successfully created',
      });
    } catch (err) {
      return res.status(400).send(err);
    }
  } else {
    const newsId = newsletters[0]._id;
    const updatedNewsletter = await Newsletter.findOneAndUpdate(
      { _id: newsId },
      newsletterData,
      {
        new: true,
      },
    );
  
    return res.send({
      content: updatedNewsletter,
      message: 'Newsletter successfully updated',
    });
  }
});

module.exports = router;
