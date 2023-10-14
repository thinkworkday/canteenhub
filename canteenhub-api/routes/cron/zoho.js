/* eslint-disable no-nested-ternary */
/* eslint-disable no-await-in-loop */
const axios = require('axios');
const User = require('../../model/User');

async function zohoPush() {
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
      let zohoUpdateAccount;

      if (user.role === 'vendor') {
        zohoUpdateAccount = {
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

        const accountVendorData = JSON.stringify({
          data: [
            zohoUpdateAccount,
          ],
          duplicate_check_fields: [
            'Account_Name',
          ],
          trigger: [
            'workflow',
          ],
        });
        const zohoAccountVendorConfig = {
          method: 'POST',
          url: 'https://www.zohoapis.com.au/crm/v4/Accounts/upsert',
          headers: {
            Authorization: `Zoho-oauthtoken ${zohoAccessToken}`,
            'Content-Type': 'application/json',
          },
          data: accountVendorData,
        };
        let zohoAccountVendorID;
        try {
          const zohoAccountVendorData = await axios(zohoAccountVendorConfig);
          zohoAccountVendorID = zohoAccountVendorData.data.data[0].details.id;

          const zohoVendorContactRequest = {
            Account_Name: {
              id: zohoAccountVendorID,
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
            duplicate_check_fields: [
              'Email',
            ],
            trigger: [
              'workflow',
            ],
          });
          const zohoVendorContactConfig = {
            method: 'POST',
            url: 'https://www.zohoapis.com.au/crm/v4/Contacts/upsert',
            headers: {
              Authorization: `Zoho-oauthtoken ${zohoAccessToken}`,
              'Content-Type': 'application/json',
            },
            data: zohoVendorContactData,
          };
          try {
            await axios(zohoVendorContactConfig);
          } catch (error) {
            console.log(error.message, 'Contact Issue');
          }
        } catch (error) {
          console.log(error.message, 'Account Issue For Vendor');
        }
        if (user.stores.length > 0) {
          for (const store of user.stores) {
            zohoUpdateAccount = {
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
                id: zohoAccountVendorID,
              },
            };

            const accountData = JSON.stringify({
              data: [
                zohoUpdateAccount,
              ],
              duplicate_check_fields: [
                'Account_Name',
              ],
              trigger: [
                'workflow',
              ],
            });
            const zohoAccountStoreConfig = {
              method: 'POST',
              url: 'https://www.zohoapis.com.au/crm/v4/Accounts/upsert',
              headers: {
                Authorization: `Zoho-oauthtoken ${zohoAccessToken}`,
                'Content-Type': 'application/json',
              },
              data: accountData,
            };

            try {
              const zohoAccountVendorStoreData = await axios(zohoAccountStoreConfig);
              const zohoAccountVendorStoreID = zohoAccountVendorStoreData.data.data[0].details.id;

              const zohoContactRequest = {
                Account_Name: {
                  id: zohoAccountVendorStoreID,
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
                duplicate_check_fields: [
                  'Email',
                ],
                trigger: [
                  'workflow',
                ],
              });

              const zohoContactStoreConfig = {
                method: 'POST',
                url: 'https://www.zohoapis.com.au/crm/v4/Contacts/upsert',
                headers: {
                  Authorization: `Zoho-oauthtoken ${zohoAccessToken}`,
                  'Content-Type': 'application/json',
                },
                data: zohoContactData,
              };
              try {
                await axios(zohoContactStoreConfig);
              } catch (error) {
                console.log(error.message, 'Contact Issue');
              }
            } catch (error) {
              console.log(error.message, 'Account Issue For Store Vendor');
            }
          }
        }
      } else if (user.role === 'group') {
        zohoUpdateAccount = {
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
            zohoUpdateAccount,
          ],
          duplicate_check_fields: [
            'Account_Name',
          ],
          trigger: [
            'workflow',
          ],
        });

        const zohoAccountConfig = {
          method: 'POST',
          url: 'https://www.zohoapis.com.au/crm/v4/Accounts/upsert',
          headers: {
            Authorization: `Zoho-oauthtoken ${zohoAccessToken}`,
            'Content-Type': 'application/json',
          },
          data: accountData,
        };

        try {
          const zohoAccountSchoolData = await axios(zohoAccountConfig);
          const zohoAccountSchoolID = zohoAccountSchoolData.data.data[0].details.id;
          const zohoContactRequest = {
            Account_Name: {
              id: zohoAccountSchoolID,
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
            duplicate_check_fields: [
              'Email',
            ],
            trigger: [
              'workflow',
            ],
          });

          const zohoContactSchoolConfig = {
            method: 'POST',
            url: 'https://www.zohoapis.com.au/crm/v4/Contacts/upsert',
            headers: {
              Authorization: `Zoho-oauthtoken ${zohoAccessToken}`,
              'Content-Type': 'application/json',
            },
            data: zohoContactData,
          };
          try {
            await axios(zohoContactSchoolConfig);
          } catch (error) {
            console.log(error.message, 'Contact Issue');
          }
        } catch (error) {
          console.log(error.message, 'Account Issue For School');
        }
      }
    }
    console.log('***** Zoho Updated ******');
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  zohoPush,
};
