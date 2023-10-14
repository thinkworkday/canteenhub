/* eslint-disable consistent-return */
const router = require('express').Router();
const ObjectId = require('mongodb').ObjectID;
const verifyUser = require('../utils/verifyToken');
const testModeCheck = require('../utils/testMode');

// ** Models
const Order = require('../model/Order');
const OrderNote = require('../model/OrderNotes');

// const { formatPrice, formatDate } = require('../utils/utils');

// ** SendGrid
const sendEmail = require('../utils/sendGrid/sendEmail');
const { emailTemplates } = require('../utils/sendGrid/emailTemplates');

// ** Create Order Notes
router.post('/create', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'store', 'customer']), async (req, res) => {
  const orderNoteData = req.body;

  const orderNote = new OrderNote({
    ...orderNoteData,
    createdBy: res.user._id,
    createdByModel: res.user.role === 'admin' ? 'Administrator' : 'User',
  });

  try {
    const savedOrderNote = await orderNote.save();
    const isReply = !!orderNote.noteParent;

    // if a reply also need to update the parent status
    if (isReply && (orderNote.status === 'approved' || orderNote.status === 'declined')) {
      await OrderNote.findOneAndUpdate({ _id: orderNote.noteParent }, { status: orderNote.status });
    }

    // Get Store from Order
    const order = await Order.findById(orderNoteData.order)
      .populate({
        path: 'customer',
        select: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
        },
      })
      .populate({
        path: 'vendor',
        select: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
        },
      })
      .populate({
        path: 'event',
        populate: {
          path: 'store',
          select: {
            _id: 1,
            storeName: 1,
            storeEmail: 1,
          },
        },
      });

    // send email notification to Vendor or Customer
    let emailRecipient = order.vendor.email;

    if (isReply) {
      emailRecipient = order.customer.email;
      const emailContent = `${order.event.store.storeName} has ${orderNote.status} your order modification to Order #${order.orderNumber}</strong>`;
      emailTemplates.blankTemplate.dynamic_template_data.subject = 'You have received a response to your order modification request on Canteen Hub';
      emailTemplates.blankTemplate.dynamic_template_data.email_text = emailContent;
      emailTemplates.blankTemplate.dynamic_template_data.btn_text = 'View order';
      emailTemplates.blankTemplate.dynamic_template_data.btn_url = `${process.env.FRONTEND_URL}/customer/order/edit/${order.orderNumber}`;
    } else {
      const emailContent = `A customer has requested a modification to an order on Canteen Hub.<br /><br /><strong>Order #${order.orderNumber}</strong>`;
      emailTemplates.blankTemplate.dynamic_template_data.subject = 'You have received an order modification request on Canteen Hub';
      emailTemplates.blankTemplate.dynamic_template_data.email_text = emailContent;
      emailTemplates.blankTemplate.dynamic_template_data.btn_text = 'View modification';
      emailTemplates.blankTemplate.dynamic_template_data.btn_url = `${process.env.FRONTEND_URL}/vendor/order/edit/${order.orderNumber}`;
    }

    await sendEmail([emailRecipient], {
      ...emailTemplates.blankTemplate,
    });

    return res.send({ savedOrderNote, message: 'Order note successfully created' });
  } catch (err) {
    return res.status(400).send(err);
  }
});

// ** Get Order Notes
router.get('/list/', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'customer', 'vendor', 'group']), async (req, res) => {
  // Get the parent vendor ID (if admin, then this must be provided)
  const { orderId } = req.query;

  try {
    const orderNotes = await OrderNote.aggregate(
      [
        {
          $match: {
            order: ObjectId(orderId),
            noteParent: null,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'createdBy',
          },
        },
        {
          $lookup: {
            from: 'ordernotes',
            localField: '_id',
            foreignField: 'noteParent',
            as: 'replies',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'replies.createdBy',
            foreignField: '_id',
            as: 'repliesNotes',
          },
        },
        {
          $set: {
            replies: {
              $map: {
                input: '$replies',
                in: {
                  $mergeObjects: [
                    '$$this',
                    {
                      createdBy: {
                        $arrayElemAt: [
                          '$repliesNotes',
                          {
                            $indexOfArray: [
                              '$repliesNotes._id',
                              '$$this.id',
                            ],
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            },
            repliesNotes: '$$REMOVE',
          },
        },
        {
          $lookup: {
            from: 'administrators',
            localField: 'replies.createdBy',
            foreignField: '_id',
            as: 'repliesAdminNotes',
          },
        },
        {
          $set: {
            replies: {
              $map: {
                input: '$replies',
                in: {
                  $mergeObjects: [
                    '$$this',
                    {
                      createdBy: {
                        $arrayElemAt: [
                          '$repliesAdminNotes',
                          {
                            $indexOfArray: [
                              '$repliesAdminNotes._id',
                              '$$this.id',
                            ],
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            },
            repliesNotes: '$$REMOVE',
          },
        },
        {
          $project: {
            order: 1,
            notes: 1,
            status: 1,
            createdBy: {
              firstName: 1,
              lastName: 1,
              email: 1,
              role: 1,
            },
            createdAt: 1,
            updatedAt: 1,
            replies: {
              order: 1,
              noteParent: 1,
              notes: 1,
              status: 1,
              createdBy: {
                firstName: 1,
                lastName: 1,
                email: 1,
                role: 1,
              },
              createdAt: 1,
              updatedAt: 1,
            },
          },
        },
        {
          $unwind: {
            path: '$createdBy',
          },
        },
      ],
    );

    return res.send({
      totalCount: orderNotes.length,
      filteredCount: orderNotes.length,
      results: orderNotes,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`findOne error--> ${error}`);
    return error;
  }
});

// Get Order Note
router.get('/:orderNumber', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'customer', 'vendor', 'storeProfile First Name', 'group']), async (req, res) => {
  // Ensure Vendor and Customer can only view their own orders
  const vendorFilter = res.user.role === 'vendor' ? { vendor: res.user._id } : {};
  const customerFilter = res.user.role === 'customer' ? { customer: res.user._id } : {};

  const filterParams = {
    $and: [
      // searchQuery,
      { orderNumber: req.params.orderNumber },
      vendorFilter,
      customerFilter,
    ],
  };

  const order = await Order.findOne(filterParams)
    .populate({
      path: 'event',
      populate: {
        path: 'store',
        select: {
          _id: 1,
          storeName: 1,
          storeEmail: 1,
          storePhone: 1,
          storeLogo: 1,
          storeAddress: 1,
        },
        populate: {
          path: 'storeAddress',
        },
      },
    })
    .populate({
      path: 'customer',
      select: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        notes: 1,
        email: 1,
      },
    })
    .populate({
      path: 'createdBy',
      select: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        role: 1,
      },
    });

  if (!order) {
    return res.status(400).send('No order found');
  }

  // if customer, double check they can see this record
  if (
    res.user.role === 'customer'
      && res.user._id !== String(order.customer._id)
  ) {
    return res
      .status(400)
      .send('You do not have permission to view this order');
  }

  // if (menu.status === 'deleted') {
  //   return res.status(400).send('Menu was previously created however is now deleted');
  // }
  return res.send(order);
});

module.exports = router;
