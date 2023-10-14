const router = require('express').Router();
// const bcrypt = require('bcrypt');
// const { isValidObjectId } = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
// const ObjectId = require('mongodb').ObjectID;

const verifyUser = require('../utils/verifyToken');

// ** Models
const User = require('../model/User');
const Invite = require('../model/Invites');
// const Address = require('../model/Address');

// ** utils
const { generateInviteURL } = require('../utils/utils');

// creating the storage variable to upload the file and providing the destination folder,
// if nothing is provided in the callback it will get uploaded in main directory

// ** SendGrid
const sendEmail = require('../utils/sendGrid/sendEmail');
const { emailTemplates } = require('../utils/sendGrid/emailTemplates');

// const { formatGoogleAddress } = require('../utils/utils');
const { inviteValidation } = require('../utils/validation');

// ** Create Invite
router.post('/create', verifyUser(['admin', 'vendor']), async (req, res) => {
  const inviteData = req.body;

  // Check user can invite
  const reqUser = await User.findById(res.user._id).select({ role: 1, companyName: 1 });
  if (reqUser.role === 'vendor' && inviteData.toRole !== 'group') {
    return res.status(403).send(`Permission denied: you do not have permission to invite ${inviteData.toRole} users`);
  }

  // Invite from will come from API request
  inviteData.inviteFrom = res.user._id;

  // validate request
  const { error } = inviteValidation(inviteData);
  if (error) { return res.status(400).send(error.details[0].message); }

  // Check this user has not already been invited by the same person
  const alreadyInvited = await Invite.findOne({ inviteFrom: res.user._id, toEmail: inviteData.toEmail });
  if (alreadyInvited) {
    return res.status(403).send('Permission denied: you have already sent an invite to this user. Please wait for their response');
  }

  const invite = new Invite({
    ...inviteData,
  });

  try {
    const inviteResp = await invite.save();

    // Send invite to user
    const inviteURL = await generateInviteURL(inviteResp._id);
    emailTemplates.invite.dynamic_template_data.subject = `You have a pending invitation from ${reqUser.companyName} on Canteen Hub`;
    emailTemplates.invite.dynamic_template_data.toName = inviteData.toFirstName;
    emailTemplates.invite.dynamic_template_data.fromCompanyName = reqUser.companyName;
    emailTemplates.invite.dynamic_template_data.btn_url = inviteURL;
    await sendEmail(
      [inviteData.toEmail],
      {
        ...emailTemplates.invite,
      },
    );

    return res.send({ invite: inviteResp, message: 'Invite sent' });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return res.status(400).send(err);
  }
});

// ** Get Invites
router.get('/list/:status?', verifyUser(['admin', 'vendor', 'group']), async (req, res) => {
  // First check the user requesting
  // const reqUser = await User.findById(res.user._id).select('role');
  // if (!reqUser) { return res.status(400).send('Vendor does not exist'); }

  const statusFilter = req.params.status ? { status: req.params.status } : '';

  const invites = await Invite.find({ inviteFrom: res.user._id, ...statusFilter }).populate({
    path: 'inviteFrom',
    select: 'firstName lastName email role status companyName',
  });

  const totalCount = await Invite.countDocuments({
    inviteFrom: res.user._id,
  });

  return res.send({
    totalCount,
    filteredCount: invites.length,
    results: invites,
  });
});

// ** Get Invites Received
router.get('/received/:status?', verifyUser(['admin', 'vendor', 'group']), async (req, res) => {
  // First check the user requesting
  // const reqUser = await User.findById(res.user._id).select('role');
  // if (!reqUser) { return res.status(400).send('Vendor does not exist'); }

  const statusFilter = req.params.status ? { status: req.params.status } : '';

  // get my email
  const email = await User.findById(res.user._id).select('email');

  const invites = await Invite.find({ toEmail: email.email, ...statusFilter }).populate({
    path: 'inviteFrom',
    select: 'firstName lastName email role status companyName',
  });

  const totalCount = await Invite.countDocuments({
    inviteFrom: res.user._id,
  });

  return res.send({
    totalCount,
    filteredCount: invites.length,
    results: invites,
  });
});

// ** Get Invite
router.get('/:id', async (req, res) => {
  const invite = await Invite.findById(req.params.id).populate({
    path: 'inviteFrom',
    select: 'firstName lastName email role status companyName',
  });
  if (!invite) {
    return res.status(400).send('Invitation not found');
  }
  return res.send(invite);
});

// ** Accept Invite
router.post('/accept/:id', verifyUser(['group']), async (req, res) => {
  try {
    const invite = await Invite.findOneAndUpdate({ _id: req.params.id }, { status: 'accepted' }, {
      returnOriginal: true,
    }).populate({
      path: 'inviteFrom',
      select: 'firstName lastName companyName email',
    });

    // Also create the connection between the vendor and the group
    await User.updateOne(
      { _id: invite.inviteFrom._id },
      { $addToSet: { groups: res.user._id } },
    );

    if (invite.status === 'pending') {
    // finally send an email to sender
      emailTemplates.userApproved.dynamic_template_data.subject = 'Your invitation has been accepted';
      emailTemplates.userApproved.dynamic_template_data.email_title = `Your invitiation to ${invite.toCompanyName} has been accepted`;
      emailTemplates.userApproved.dynamic_template_data.email_text = 'You can now login and create order dates for this school';

      await sendEmail(
        [invite.inviteFrom.email],
        {
          ...emailTemplates.userApproved,
        },
      );
    }
    return res.send(invite);
  } catch (err) {
    return res.status(400).send(err);
  }
});

// ** Decline Invite
router.post('/decline/:id', async (req, res) => {
  try {
    const invite = await Invite.findOneAndUpdate({ _id: req.params.id }, { status: 'declined' }, {
      returnOriginal: true,
    }).populate({
      path: 'inviteFrom',
      select: 'firstName lastName companyName email',
    });

    if (invite.status === 'pending') {
    // finally send an email to sender
      emailTemplates.userApproved.dynamic_template_data.subject = 'Your invitation has been declined';
      emailTemplates.userApproved.dynamic_template_data.email_title = `Your invitiation to ${invite.toCompanyName} has been declined`;
      emailTemplates.userApproved.dynamic_template_data.email_text = 'Please ensure you have made contact with invite recipients beforehand to ensure acceptance';

      await sendEmail(
        [invite.inviteFrom.email],
        {
          ...emailTemplates.userApproved,
        },
      );
    }
    return res.send(invite);
  } catch (err) {
    return res.status(400).send(err);
  }
});

module.exports = router;
