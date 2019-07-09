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

notifyBecomeCheaper = async ({id, url, price, old_price, title, usersVk, prev_price, shop_id}) => {
  const formData = new FormData();
  const priceDiff = prev_price - price;
  const priceDiffText = `- ${priceDiff}р`;
  const percentDiscount = calculatePercentDiscount({old_price, price});
  const percentDiscountText = percentDiscount > 0 ? `[-${percentDiscount}%]` : '';
  const shopName = await getShopName(shop_id);
  formData.append('message', `
  = ${shopName} = ${percentDiscountText} ${priceDiffText}
  ${title} ${price}р
  ${prev_price}р -> ${price}р
   ${url}`);

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

const goodBecomeCheaper = async ({id, url, price, old_price, title, prev_price, shop_id}) => {
  if (!id)
    throw new Error(`Good id required.`);
  const subscriptions = await subscriptionService.search({good_id: id});
  const filteredSubscriptions = subscriptions.filter(({price_discount, percent_discount}) => {
    if (!!price_discount) {
      return price <= price_discount;
    }
    if (!!percent_discount) {
      return calculatePercentDiscount({old_price, price}) >= percent_discount;
    }
    return true;
  });

  while (filteredSubscriptions.length > 0) {
    const chunk = filteredSubscriptions.splice(0, 100);
    const usersVk = chunk.map(subscription => subscription.user_vk).join(',');
    const result = await notifyBecomeCheaper({url, usersVk, price, old_price, title, prev_price, shop_id});
    log(`[goodBecomeCheaper] [chunk] done`, result);
  }
};

module.exports = {
  goodBecomeCheaper
};