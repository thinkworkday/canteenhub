const Joi = require('@hapi/joi');

// Register Validation
const registerValidation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string(),
    abn: Joi.string(),
    password: Joi.string().min(6).required(),
    role: Joi.string().required(),
    status: Joi.string(),
    companyName: Joi.string(),
    ability: Joi.array(),
    stores: Joi.array(),
    parentVendor: Joi.string(),
    addressObj: Joi.object(),
    captchaToken: Joi.string(),
  });

  return schema.validate(data);
};

// Login Validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    remember: Joi.boolean(),
    instance: Joi.string().required(),
    captchaToken: Joi.string(),
  });

  return schema.validate(data);
};

// Forgot Password Validation
const forgotPasswordValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  return schema.validate(data);
};

// Store Validation
const storeValidation = (data) => {
  const schema = Joi.object({
    vendor: Joi.string(),
    storeName: Joi.string().required(),
    storeEmail: Joi.string().email().required(),
    storePhone: Joi.string().required(),
    addressObj: Joi.object(),
    storeUsers: Joi.array(),
    storeLogo: Joi.any(),
    // status: Joi.string(),
    // companyName: Joi.string(),

    // stores: Joi.array(),
    // parentVendor: Joi.string(),
    //
  });

  return schema.validate(data);
};

// Charity Validation
const charityValidation = (data) => {
  const schema = Joi.object({
    charityName: Joi.string().required(),
    charityEmail: Joi.string().email().required(),
    charityABN: Joi.string().allow(''),
    charityPhone: Joi.string().allow(''),
    charityContactFirstname: Joi.string().allow(''),
    charityContactLastname: Joi.string().allow(''),
    charityLogo: Joi.any(),
  });

  return schema.validate(data);
};

// Subgroup Validation
const subgroupValidation = (data) => {
  const schema = Joi.object({
    group: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().allow(''),
    contactFirstName: Joi.string().allow(''),
    contactLastName: Joi.string().allow(''),
    contactEmail: Joi.string().allow(''),
    type: Joi.string().required(),
  });

  return schema.validate(data);
};

// Profile Validation
const profileValidation = (data) => {
  const schema = Joi.object({
    customer: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().allow(''),
    allergies: Joi.array(),
    group: Joi.string().allow(null),
    subgroups: Joi.array(),
    notes: Joi.string().allow(''),
  });

  return schema.validate(data);
};

// Invite Validation
const inviteValidation = (data) => {
  const schema = Joi.object({
    inviteFrom: Joi.string().required(),
    toCompanyName: Joi.string(),
    toFirstName: Joi.string().required(),
    toLastName: Joi.string().required(),
    toEmail: Joi.string().email().required(),
    toRole: Joi.string().required(),
  });

  return schema.validate(data);
};

// Menu Validation
const menuValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(''),
    menuParent: Joi.string().allow(''),
    menuData: Joi.array().allow(''),
    vendors: Joi.array().allow(''),
    createdBy: Joi.string().required(),
    createdByModel: Joi.string().required(),
  });

  return schema.validate(data);
};

// Menu Item Validation
const menuItemValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(''),
    price: Joi.number().precision(2).allow(''),
    image: Joi.any(),
    type: Joi.string(),
    tags: Joi.array().allow(''),
    createdBy: Joi.string().required(),
    createdByModel: Joi.string().required(),
  });

  return schema.validate(data);
};

// Menu Option Validation
const menuOptionValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(''),
    multiSelect: Joi.boolean(),
    mandatory: Joi.boolean(),
    options: Joi.array().allow(''),
    createdBy: Joi.string().required(),
    createdByModel: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.forgotPasswordValidation = forgotPasswordValidation;
module.exports.storeValidation = storeValidation;
module.exports.charityValidation = charityValidation;
module.exports.inviteValidation = inviteValidation;
module.exports.subgroupValidation = subgroupValidation;
module.exports.profileValidation = profileValidation;
module.exports.menuValidation = menuValidation;
module.exports.menuItemValidation = menuItemValidation;
module.exports.menuOptionValidation = menuOptionValidation;
