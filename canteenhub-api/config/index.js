module.exports = {
  stripe: {
    secretKey: process.env.STRIPE_SEC_KEY || 'YOUR_STRIPE_SECRET_KEY',
    publishableKey: process.env.STRIPE_PUB_KEY || 'YOUR_STRIPE_PUBLISHABLE_KEY',
    clientId: process.env.STRIPE_CLIENT_KEY || 'YOUR_STRIPE_CLIENT_ID',
    authorizeUri: 'https://connect.stripe.com/express/oauth/authorize',
    tokenUri: 'https://connect.stripe.com/oauth/token',
  },
  publicDomain: process.env.FRONTEND_URL,
  server_url: process.env.SERVER_URL,
};
