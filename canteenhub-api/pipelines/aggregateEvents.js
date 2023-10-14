const eventPipeline = [
  {
    $lookup: {
      from: 'stores',
      let: { store: '$store' },
      pipeline: [
        { $match: { $expr: { $eq: ['$_id', '$$store'] } } },
        { $project: { storeName: 1 } },
      ],
      as: 'store',
    },
  },
  { $unwind: { path: '$store' } },
  {
    $lookup: {
      from: 'users',
      let: { group: '$group' },
      pipeline: [
        { $match: { $expr: { $eq: ['$_id', '$$group'] } } },
        { $project: { companyName: 1 } },
      ],
      as: 'group',
    },
  },
  {
    $unwind: { path: '$group' },
  },
  {
    $addFields: { menus: { $ifNull: ['$menus', []] } },
  },
  {
    $lookup: {
      from: 'menus',
      let: { menus: '$menus' },
      pipeline: [
        { $match: { $expr: { $in: ['$_id', '$$menus'] } } },
        { $project: { name: 1 } },
      ],
      as: 'menus',
    },
  },
  {
    $lookup: {
      from: 'menus',
      let: { menuVendor: '$vendor' },
      pipeline: [
        { $match: { $expr: { $in: ['$$menuVendor', { $ifNull: ['$vendors', []] }] } } },
        { $limit: 1 },
        { $project: { name: 1 } },
      ],
      as: 'menuDefault',
    },
  },
  {
    $lookup: {
      from: 'users',
      let: { vendor: '$vendor' },
      pipeline: [
        { $match: { $expr: { $eq: ['$_id', '$$vendor'] } } },
        { $project: { companyName: 1 } },
      ],
      as: 'vendor',
    },
  },
  {
    $unwind: { path: '$vendor' },
  },
];
module.exports = { eventPipeline };
