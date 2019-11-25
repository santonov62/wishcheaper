const fetch = require('node-fetch');
const FormData = require('form-data');
const subscriptionService = require('./subscriptions.service');
const shopService = require('./shops.service');

const apiVersion = process.env.VK_API_VERSION;
if (!apiVersion) {
  console.error('ERROR!: Please set VK_API_VERSION to .env file before running the app.');
  process.exit();
}
const accessToken = process.env.VK_COMMUNITY_KEY;
if (!accessToken) {
  console.error('ERROR!: Please set VK_COMMUNITY_KEY to .env file before running the app.');
  process.exit();
}

const log = (text, params) => {
  console.log(`[vk.service] -> ${text}`, params);
};

const calculatePercentDiscount = ({old_price, price}) => {
  return old_price ? Number((100 - price / (old_price / 100)).toFixed()) : 0;
};

let shops;
const getShopName = async (id) => {
  if (!shops)
    shops = await shopService.getAll();

  const shop = shops.find(shop => shop.id === id);
  return shop.name
};

const sendVk = async ({message, usersVk}) => {
  const formData = new FormData();
  formData.append('message', message);
  formData.append('user_ids', usersVk);
  formData.append('access_token', accessToken);
  formData.append('v', apiVersion);

  return fetch(`https://api.vk.com/method/messages.send`, {
    method: 'POST',
    body: formData,
  })
    .then(res => res.json())
    .then((json) => {
      const {error} = json;
      if (!!error)
        throw new Error(error.error_msg);
      log(`[notify] done`, json);
      return json;
    });
};

const notifyGoodBecameCheaper = async ({id, url, price, old_price, title, usersVk, prev_price,
                                         shop_id, min_price, currency, isDiscountedProductBecameAvailable}) => {
  currency = currency || '₽';
  const oldPriceText = !!old_price ? `${old_price} ${currency} ->` : ``;
  const priceDiff = old_price && old_price - price;
  const priceDiffText = !!priceDiff ? `[-${priceDiff} ${currency}]` : ``;
  const lastPriceDiff = prev_price - price;
  // const lastPriceDiffText = lastPriceDiff !== 0 ? `Снижение -${lastPriceDiff}${currency}` : `Появился в наличии`;
  const lastPriceDiffText = !isDiscountedProductBecameAvailable ? `Снижение -${lastPriceDiff}${currency}` : `Появился в наличии`;
  const percentDiscount = calculatePercentDiscount({old_price, price});
  const percentDiscountText = percentDiscount > 0 ? `[${percentDiscount}%]` : '';
  const shopName = await getShopName(shop_id);
  const importantText = price === min_price ? 'ϟϟϟ' : price <= min_price + price * 0.01 ? `!!!` : ``;
  const minPriceText = !!min_price && `Мин ${min_price} ${currency}`;
  const priceText = `Цена ${price} ${currency}`;
  const productUrl = `https://wishcheaper.herokuapp.com/my?id=${id}`;
  const message = `
  ${importantText} ${percentDiscountText} ${shopName}
  ${title} за ${price} ${currency}
  > ${lastPriceDiffText}
  > ${priceText}
  > ${minPriceText}
  > ${oldPriceText} ${price} ${currency} ${priceDiffText}
  Товар
  ${url}
  Подписка
  ${productUrl}`;

  return sendVk({message, usersVk});
};

const notifyAutobuySuccess = async ({id, url, price, old_price, title, usersVk, prev_price, shop_id, buyPrice}) => {
  const shopName = await getShopName(shop_id);
  const message = `
  КУПЛЕНО за ${buyPrice}р [${shopName}]
  ${title}
  ${url}`;

  return sendVk({message, usersVk});
};

const notifyGoodBecameCheaperAll = async ({good, subscriptions}) => {
  const {id} = good;
  if (!id)
    throw new Error(`Good id required.`);

  while (subscriptions.length > 0) {
    const chunk = subscriptions.splice(0, 100);
    const usersVk = chunk.map(subscription => subscription.user_vk).join(',');
    const result = await notifyGoodBecameCheaper({...good, usersVk});
    log(`[goodBecomeCheaper] [chunk] done`, result);
  }
};

module.exports = {
  notifyGoodBecameCheaper: notifyGoodBecameCheaperAll,
  notifyAutobuySuccess
};