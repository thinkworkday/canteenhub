/* eslint-disable no-console */
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cron = require('node-cron');
// const sessions = require('express-session');
const cors = require('cors');

const app = express();
const mongoose = require('mongoose');

const dotenv = require('dotenv');

// Import routes
const settingsRoute = require('./routes/settings');
const authRoute = require('./routes/auth');
const recordRoute = require('./routes/records');
const administratorsRoute = require('./routes/administrators');
const userRoute = require('./routes/users');
const orderRoute = require('./routes/orders');
const orderNotesRoute = require('./routes/orderNotes');
const cartOrderRoute = require('./routes/cartOrders');
const eventRoute = require('./routes/events');
const groupRoute = require('./routes/groups');
const storeRoute = require('./routes/stores');
const storeUsersRoute = require('./routes/storeUsers');
const subGroupRoute = require('./routes/subGroups');
const profileRoute = require('./routes/profiles');

const postRoute = require('./routes/posts');
const notificationRoute = require('./routes/notifications');
const mediaRoute = require('./routes/media');
const menuRoute = require('./routes/menus');
const menuItemsRoute = require('./routes/menuItems');
const menuOptionsRoute = require('./routes/menuOptions');
const inviteRoute = require('./routes/invites');
const paymentRoute = require('./routes/payments');
const healthStarRoute = require('./routes/healthstars');
const reportsRoute = require('./routes/reports');
const webhooksRoute = require('./routes/webhooks');
const testModesRoute = require('./routes/testModes');
const charitiesRoute = require('./routes/charities');
const marketsRoute = require('./routes/markets');
const marketSiteRoute = require('./routes/marketSite');
const newsletterRoute = require('./routes/newsletters');
const testRoute = require('./routes/tests');

dotenv.config();
const PORT = process.env.PORT || 3008;

// Cron for Zoho
const zohoCron = require('./routes/cron/zoho');

// Connect to DB
mongoose.connect(process.env.MONGO_URL, () => console.log('💾 Connected to DB'));

// Stripe webhooks - need to declare before bodyparser
app.use('/api/webhooks', webhooksRoute);

// increase parse limit
app.use(bodyParser.json({ limit: '50mb', extended: true }));

// Middleware
app.use(
  cors({
    credentials: true,
    origin: [
      'http://localhost:3000',
      'https://staging-app.canteenhub.com.au',
      'https://app.canteenhub.com.au',
      'https://canteenhub.com.au',
    ],
  }),
);

app.use(express.json());
app.use(cookieParser());

// Route middleware
app.get('/', (req, res) => {
  res.send('Canteenhub api server is running!');
});

// cron.schedule(
//   '0 1 * * *',
//   zohoCron.zohoPush,
//   {
//     scheduled: true,
//     timezone: 'Australia/Sydney',
//   },
// );
app.use('/api/settings', settingsRoute);
app.use('/api/auth', authRoute);
app.use('/api/records', recordRoute);
app.use('/api/administrators', administratorsRoute);
app.use('/api/users', userRoute);
app.use('/api/orders', orderRoute);
app.use('/api/orderNotes', orderNotesRoute);
app.use('/api/cartOrders', cartOrderRoute);
app.use('/api/events', eventRoute);
app.use('/api/groups', groupRoute);
app.use('/api/menus', menuRoute);
app.use('/api/menuItems', menuItemsRoute);
app.use('/api/menuOptions', menuOptionsRoute);
app.use('/api/stores', storeRoute);
app.use('/api/storeUsers', storeUsersRoute);
app.use('/api/subgroups', subGroupRoute);
app.use('/api/profiles', profileRoute);
app.use('/api/posts', postRoute);
app.use('/api/notifications', notificationRoute);
app.use('/api/media', mediaRoute);
app.use('/api/payments', paymentRoute);
app.use('/api/invites', inviteRoute);
app.use('/api/healthstars', healthStarRoute);
app.use('/api/reports', reportsRoute);
app.use('/api/charities', charitiesRoute);
app.use('/api/testModes', testModesRoute);
app.use('/api/market', marketsRoute);
app.use('/api/marketSite', marketSiteRoute);
app.use('/api/newsletter', newsletterRoute);
app.use('/api/test', testRoute);

app.listen(PORT, () => console.log(`🏎  API Server up and running at ${process.env.SERVER_URL}`));
