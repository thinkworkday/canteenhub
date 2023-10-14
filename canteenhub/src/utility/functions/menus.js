/**
 ** Fetch Price for a menu item
 * @param {Object} item catalogue item object to obtain price for
 * @param {Object} menu the menu to which the item exists - required for custom pricing
 */
export const fetchItemPrice = (item, menu) => {
  if (!item) return false;
  if (!menu) return false;
  const itemModifications = menu.menuItemModifications ? menu.menuItemModifications.find(((obj) => obj.itemId === item._id)) : {};
  const itemPrice = item._id && item.prices ? item.prices : [];

  const itemJoin = itemPrice.map((item1) => {
    const item2 = itemModifications?.newPrice.find((item2) => item2.currency === item1.currency) || {};
    return { ...item1, ...item2 };
  });

  const objItems = itemJoin.map((iPrice) => {
    const priceCustom = !!(iPrice[`newPrice${iPrice.currency}`] && iPrice[`newPrice${iPrice.currency}`] !== '');
    return {
      itemCurrency: iPrice.currency, itemPriceOrig: parseFloat(iPrice.amount), itemPrice: priceCustom ? parseFloat(iPrice[`newPrice${iPrice.currency}`]) : null, priceCustom,
    };
  });
  return objItems;
};

/**
 ** Fetch Unavailable Options
 * @param {Object} menu menu which you want to get unavailable options from
 * @param {Object} menuOptions menuOptions model which includes the source data (name)
 */
export const fetchUnavailableOptions = (menu, menuOptions) => {
  if (!menuOptions) return false;
  if (!menu.menuOptionModifications[0]) return false;
  const menuOptionValues = [...new Set(menuOptions.map((option) => option.options).flat())];
  const { unavailableMenuOptions } = menu.menuOptionModifications[0];
  const unavailableMenuOptionsObj = menuOptionValues.filter((option) => (unavailableMenuOptions.includes(option.id)));
  return unavailableMenuOptionsObj;
};

/**
 ** Fetch Group Menu
 * @param {Object} event
 */
export const fetchEventMenu = (event) => {
  const menu = 'get menu';
  // if (!menuOptions) return false;
  // if (!menu.menuOptionModifications[0]) return false;
  // const menuOptionValues = [...new Set(menuOptions.map((option) => option.options).flat())];
  // const { unavailableMenuOptions } = menu.menuOptionModifications[0];
  // const unavailableMenuOptionsObj = menuOptionValues.filter((option) => (unavailableMenuOptions.includes(option.id)));
  // return unavailableMenuOptionsObj;
  return menu;
};
