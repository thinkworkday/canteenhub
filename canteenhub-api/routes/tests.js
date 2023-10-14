/* eslint-disable no-nested-ternary */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
const router = require('express').Router();
const axios = require('axios');
const Profiles = require('../model/Profiles');
const User = require('../model/User');

router.get('/profiles/:customerId?', async (req, res) => {
  const { customerId } = req.params;
  if (!customerId) { return res.status(400).send('Please Provide the customer ID'); }
  try {
    const profiles = await Profiles.find({ customer: customerId, status: { $ne: 'deleted' } }).populate({
      path: 'subgroups',
      select: '-__v',
      populate: {
        path: 'group',
        select: '_id companyName',
      },
    }).select('-__v');

    return res.send(profiles);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.get('/informations', async (req, res) => {
  // get Zoho accessToken
  const zohoConfig = {
    method: 'POST',
    url: `https://accounts.zoho.com.au/oauth/v2/token?refresh_token=${process.env.ZOHO_REFRESH_TOKEN}&client_id=${process.env.ZOHO_CLIENT_ID}&client_secret=${process.env.ZOHO_CLIENT_SECRET}&grant_type=${process.env.ZOHO_GRANT_TYPE}`,
    headers: {},
  };
  try {
    const zohoResponse = await axios(zohoConfig);
    const zohoAccessToken = zohoResponse.data.access_token;
    const users = await User.aggregate(
      [
        {
          $match: {
            $or: [
              { role: 'vendor' },
              { role: 'group' },
            ],
          },
        },
        {
          $lookup: {
            from: 'addresses',
            localField: 'address',
            foreignField: '_id',
            pipeline: [
              {
                $project: {
                  formattedAddress: 1,
                  streetNumber: 1,
                  route: 1,
                  locality: 1,
                  politial: 1,
                  administrativeAreaLevel1: 1,
                  administrativeAreaLevel2: 1,
                  postalCode: 1,
                  country: 1,
                },
              },
            ],
            as: 'address',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'groups',
            foreignField: '_id',
            pipeline: [
              {
                $match: {
                  companyName: { $ne: null },
                },
              },
              {
                $project: {
                  firstName: 1,
                  lastName: 1,
                  email: 1,
                  companyName: 1,
                },
              },
            ],
            as: 'groups',
          },
        },
        {
          $lookup: {
            from: 'stores',
            localField: '_id',
            foreignField: 'vendor',
            pipeline: [
              {
                $lookup: {
                  from: 'addresses',
                  localField: 'storeAddress',
                  foreignField: '_id',
                  pipeline: [
                    {
                      $project: {
                        formattedAddress: 1,
                        streetNumber: 1,
                        route: 1,
                        locality: 1,
                        politial: 1,
                        administrativeAreaLevel1: 1,
                        administrativeAreaLevel2: 1,
                        postalCode: 1,
                        country: 1,
                      },
                    },
                  ],
                  as: 'storeAddress',
                },
              },
              {
                $project: {
                  storeName: 1,
                  storeEmail: 1,
                  storePhone: 1,
                  storeAddress: 1,
                },
              },
            ],
            as: 'stores',
          },
        },
        {
          $project: {
            firstName: 1,
            lastName: 1,
            email: 1,
            role: 1,
            status: 1,
            companyName: 1,
            address: 1,
            groups: 1,
            stores: 1,
          },
        },
      ],
    );
    for (const user of users) {
      const layoutId = user.role === 'vendor' ? '52791000000321007' : '52791000000000627';
      let zohoAccount;

      if (user.role === 'vendor') {
        zohoAccount = {
          Account_Name: user.companyName,
          Phone: user.phoneNumber ? user.phoneNumber : '',
          Billing_Street: user.address.length > 0 ? user.address[0].route : '',
          Billing_City: user.address.length > 0 ? user.address[0].locality : '',
          Billing_State: user.address.length > 0 ? user.address[0].administrativeAreaLevel1 : '',
          Billing_Code: user.address.length > 0 ? user.address[0].postalCode : '',
          Billing_Country: user.address.length > 0 ? user.address[0].country : '',
          Shipping_Street: user.address.length > 0 ? user.address[0].route : '',
          Shipping_City: user.address.length > 0 ? user.address[0].locality : '',
          Shipping_State: user.address.length > 0 ? user.address[0].administrativeAreaLevel1 : '',
          Shipping_Code: user.address.length > 0 ? user.address[0].postalCode : '',
          Shipping_Country: user.address.length > 0 ? user.address[0].country : '',
          Canteenhub_ID: user._id,
          Layout: {
            id: layoutId,
          },
        };
        console.log(zohoAccount, 'for vendor zohoAccount');
        const accountVendorData = JSON.stringify({
          data: [
            zohoAccount,
          ],
          trigger: [
            'approval',
            'workflow',
            'blueprint',
          ],
        });
        const zohoAccountVendorConfig = {
          method: 'POST',
          url: 'https://www.zohoapis.com.au/crm/v4/Accounts',
          headers: {
            Authorization: `Zoho-oauthtoken ${zohoAccessToken}`,
            'Content-Type': 'application/json',
          },
          data: accountVendorData,
        };
        let zohoVendorAccountID;
        try {
          const zohoAccountVendorResponse = await axios(zohoAccountVendorConfig);
          zohoVendorAccountID = zohoAccountVendorResponse.data.data[0].details.id;
          const zohoVendorContactRequest = {
            Account_Name: {
              id: zohoVendorAccountID,
            },
            First_Name: user.firstName,
            Last_Name: user.lastName,
            Email: user.email,
            Phone: user.phoneNumber ? user.phoneNumber : '',
            Canteenhub_ID: user._id,
          };

          const zohoVendorContactData = JSON.stringify({
            data: [
              zohoVendorContactRequest,
            ],
            trigger: [
              'approval',
              'workflow',
              'blueprint',
            ],
          });
          console.log(zohoVendorContactRequest, 'for vendor zohoContact');
          const zohoVendorContactConfig = {
            method: 'POST',
            url: 'https://www.zohoapis.com.au/crm/v4/Contacts',
            headers: {
              Authorization: `Zoho-oauthtoken ${zohoAccessToken}`,
              'Content-Type': 'application/json',
            },
            data: zohoVendorContactData,
          };
          try {
            const zohoContactResponse = await axios(zohoVendorContactConfig);
          } catch (error) {
            console.log(error.message, 'Contact Issue');
          }
        } catch (error) {
          console.log(error.message, 'Account Issue For Vendor');
        }
        if (user.stores.length > 0) {
          for (const store of user.stores) {
            zohoAccount = {
              Account_Name: store.storeName ? store.storeName : '',
              Phone: store.storePhone ? store.storePhone : '',
              Billing_Street: store.storeAddress.length > 0 ? store.storeAddress[0].route : '',
              Billing_City: store.storeAddress.length > 0 ? store.storeAddress[0].locality : '',
              Billing_State: store.storeAddress.length > 0 ? store.storeAddress[0].administrativeAreaLevel1 : '',
              Billing_Code: store.storeAddress.length > 0 ? store.storeAddress[0].postalCode : '',
              Billing_Country: store.storeAddress.length > 0 ? store.storeAddress[0].country : '',
              Shipping_Street: store.storeAddress.length > 0 ? store.storeAddress[0].route : '',
              Shipping_City: store.storeAddress.length > 0 ? store.storeAddress[0].locality : '',
              Shipping_State: store.storeAddress.length > 0 ? store.storeAddress[0].administrativeAreaLevel1 : '',
              Shipping_Code: store.storeAddress.length > 0 ? store.storeAddress[0].postalCode : '',
              Shipping_Country: store.storeAddress.length > 0 ? store.storeAddress[0].country : '',
              Canteenhub_ID: store._id,
              Layout: {
                id: layoutId,
              },
              Parent_Account: {
                id: zohoVendorAccountID,
              },
            };
            const accountData = JSON.stringify({
              data: [
                zohoAccount,
              ],
              trigger: [
                'approval',
                'workflow',
                'blueprint',
              ],
            });
            const zohoAccountConfig = {
              method: 'POST',
              url: 'https://www.zohoapis.com.au/crm/v4/Accounts',
              headers: {
                Authorization: `Zoho-oauthtoken ${zohoAccessToken}`,
                'Content-Type': 'application/json',
              },
              data: accountData,
            };
            console.log(accountData, 'for store zohoAccount');
            try {
              const zohoAccountResponse = await axios(zohoAccountConfig);
              const zohoAccountID = zohoAccountResponse.data.data[0].details.id;
              const zohoContactRequest = {
                Account_Name: {
                  id: zohoAccountID,
                },
                First_Name: store.storeName ? store.storeName.split(' ')[0] ? store.storeName.split(' ')[0] : '' : '',
                Last_Name: store.storeName ? store.storeName.split(' ')[1] ? store.storeName.split(' ').slice(1).join(' ') : '' : '',
                Email: store.storeEmail,
                Phone: store.storePhone ? store.storePhone : '',
                Canteenhub_ID: store._id,
              };
              // console.log(zohoContactRequest, 'vendor');
              const zohoContactData = JSON.stringify({
                data: [
                  zohoContactRequest,
                ],
                trigger: [
                  'approval',
                  'workflow',
                  'blueprint',
                ],
              });
              console.log(zohoContactRequest, 'for store zohoContact');
              const zohoContactConfig = {
                method: 'POST',
                url: 'https://www.zohoapis.com.au/crm/v4/Contacts',
                headers: {
                  Authorization: `Zoho-oauthtoken ${zohoAccessToken}`,
                  'Content-Type': 'application/json',
                },
                data: zohoContactData,
              };
              try {
                const zohoContactResponse = await axios(zohoContactConfig);
              } catch (error) {
                console.log(error.message, 'Contact Issue');
              }
            } catch (error) {
              console.log(error.message, 'Account Issue For Vendor');
            }
          }
        }
      } else if (user.role === 'group') {
        zohoAccount = {
          Account_Name: user.companyName,
          Phone: user.phoneNumber ? user.phoneNumber : '',
          Billing_Street: user.address.length > 0 ? user.address[0].route : '',
          Billing_City: user.address.length > 0 ? user.address[0].locality : '',
          Billing_State: user.address.length > 0 ? user.address[0].administrativeAreaLevel1 : '',
          Billing_Code: user.address.length > 0 ? user.address[0].postalCode : '',
          Billing_Country: user.address.length > 0 ? user.address[0].country : '',
          Shipping_Street: user.address.length > 0 ? user.address[0].route : '',
          Shipping_City: user.address.length > 0 ? user.address[0].locality : '',
          Shipping_State: user.address.length > 0 ? user.address[0].administrativeAreaLevel1 : '',
          Shipping_Code: user.address.length > 0 ? user.address[0].postalCode : '',
          Shipping_Country: user.address.length > 0 ? user.address[0].country : '',
          Canteenhub_ID: user._id,
          Layout: {
            id: layoutId,
          },
        };
        const accountData = JSON.stringify({
          data: [
            zohoAccount,
          ],
          trigger: [
            'approval',
            'workflow',
            'blueprint',
          ],
        });
        console.log(zohoAccount, 'for group zohoAccount');
        const zohoAccountConfig = {
          method: 'POST',
          url: 'https://www.zohoapis.com.au/crm/v4/Accounts',
          headers: {
            Authorization: `Zoho-oauthtoken ${zohoAccessToken}`,
            'Content-Type': 'application/json',
          },
          data: accountData,
        };

        try {
          const zohoAccountResponse = await axios(zohoAccountConfig);
          const zohoAccountID = zohoAccountResponse.data.data[0].details.id;
          const zohoContactRequest = {
            Account_Name: {
              id: zohoAccountID,
            },
            First_Name: user.firstName,
            Last_Name: user.lastName,
            Email: user.email,
            Phone: user.phoneNumber ? user.phoneNumber : '',
            Canteenhub_ID: user._id,
          };
          const zohoContactData = JSON.stringify({
            data: [
              zohoContactRequest,
            ],
            trigger: [
              'approval',
              'workflow',
              'blueprint',
            ],
          });
          console.log(zohoContactRequest, 'for group zohoContact');
          const zohoContactConfig = {
            method: 'POST',
            url: 'https://www.zohoapis.com.au/crm/v4/Contacts',
            headers: {
              Authorization: `Zoho-oauthtoken ${zohoAccessToken}`,
              'Content-Type': 'application/json',
            },
            data: zohoContactData,
          };
          try {
            const zohoContactResponse = await axios(zohoContactConfig);
          } catch (error) {
            console.log(error.message, 'Contact Issue');
          }
        } catch (error) {
          console.log(error.message, 'Account Issue For School');
        }
      }
    }
    return res.send({ message: 'Zoho configured' });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.get('/account-delete', async (req, res) => {
  const accountConfig = {
    method: 'GET',
    url: 'https://www.zohoapis.com.au/crm/v4/Accounts?converted=true&fields=Account_Name',
    headers: {
      Authorization: 'Zoho-oauthtoken 1000.7894c1b900fe86ffcf83f53803aeada9.4c3e0f1e30c1fb95db6592eced990f62',
    },
  };
  const response = await axios(accountConfig);
  console.log(response.data);
  const idList = [];
  for (const account of response.data.data) {
    idList.push(account.id);
    const config1 = {
      method: 'delete',
      url: `https://www.zohoapis.com.au/crm/v4/Accounts/${account.id}`,
      headers: {
        Authorization: 'Zoho-oauthtoken 1000.7894c1b900fe86ffcf83f53803aeada9.4c3e0f1e30c1fb95db6592eced990f62',
      },
    };
    console.log(config1);
    await axios(config1);
  }

  res.send(idList);
});

module.exports = router;
