const router = require('express').Router();
const mongoose = require('mongoose');
const verifyUser = require('../utils/verifyToken');

const TestMode = require('../model/TestModes');

//Change Test Mode
router.post('/', verifyUser(['admin']), async (req, res) => {
    const { status } = req.body;
    const testModeData = await TestMode.find().limit(1);
    let testData;
    if (testModeData.length == 0) {
        const testMode = new TestMode({
            status: status
        });
        try {
            testData = await testMode.save();
            return res.send(testData);
        } catch (error) {
            return res.status(400).send(error);
        }
    } else {
        const updateTestMode = await TestMode.updateMany({ status: !status }, { $set: { status: status } }, {
            new: true,
        });
        return res.send(updateTestMode)
    }
});

//Check Test Mode Status
router.get('/', verifyUser(['admin']), async (req, res) => {
    const testModeData = await TestMode.find().limit(1);
    let testModeStatus;
    if (testModeData.length == 0) {
        testModeStatus = false;
    } else {
        testModeStatus = testModeData[0].status;
    }
    return res.send(testModeStatus);
});

module.exports = router;