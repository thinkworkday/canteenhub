const stripe = require('stripe')(process.env.STRIPE_SEC_KEY);
// ** Models
const Order = require('../model/Order');

async function duplicatedOrderNumberCheck() {

    console.log("********* Stating Cron Job *********");
    //Duplicated OrderNumbers Get
    const duplicatedOrderNumberList = await Order.aggregate([
        { "$group": { "_id": "$orderNumber", "count": { "$sum": 1 } } },
        { "$match": { "_id": { "$ne": null }, "count": { "$gt": 1 } } },
        { "$project": { "orderNumber": "$_id", "_id": 0 } }
    ]);
    if (duplicatedOrderNumberList.length == 0) {
        console.log("No exists duplicated Order!");
    } else {
        //Update OrderNumber Wihth New Number
        for (const duplicateData of duplicatedOrderNumberList) {
            let orderFilterData = await Order.find({ orderNumber: duplicateData.orderNumber }).sort({ createdAt: -1 }).limit(1);
            let latestOrder = await Order.aggregate([
                { $sort: { orderNumber: -1 } }
            ], { allowDiskUse: true }).limit(1);

            let updateOrder = await Order.findOneAndUpdate(
                { _id: orderFilterData[0]._id },
                { $inc: { orderNumber: latestOrder[0].orderNumber - duplicateData.orderNumber + 1 } },
                { upsert: true, new: true }
            );

            //Set Manually Auto Increment For OrderNumber
            updateOrder.setNext('orderNumber', function (err, orderNum) {
                orderNum.orderNumber;
            });

            // update payment description in Stripe
            await stripe.paymentIntents.update(updateOrder.transactionData[0].id, {
                description: `Canteen Hub Orders: ${updateOrder.orderNumber}`,
                metadata: { orderCreated: true },
            });
        }
    }
    console.log('****** Cron Job End ******');

}

module.exports = {
    duplicatedOrderNumberCheck,
}