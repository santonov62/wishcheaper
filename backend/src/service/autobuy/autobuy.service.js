const pandaoAutobuy = require('./pandaoAutobuy.service');
const goodsService = require('../goods.service');
const vkService = require('../vk.service');
const db = require('../db.service');
const subscriptionService = require('../subscriptions.service');
const shopsService = require('../shops.service');

const moment = require('moment');
const autobuyInstances = [
  pandaoAutobuy
];


const log = (text, params = '') => {
  console.log(`[autobuy.service] -> ${text}`, params)
};

const buy = async ({good, subscription}) => {
  console.group(`[autobuy.service] -> [buy]`, {good, subscription});
  try {
    if (!good)
      throw new Error(`Good required.`);
    if (!subscription)
      throw new Error(`subscription required.`);
    const instance = getInstanceByUrl(good.url);
    const result = await instance.buy({
      url: good.url,
      price: good.price,
      autobuy_price: subscription.autobuy_price});
    if (!!result)
      vkService.notifyAutobuySuccess({
        ...good,
        buyPrice: result.buyPrice,
        usersVk: subscription.user_vk
      });
    log(`[buy] done`, result);
    return result;
  } catch (e) {
    console.error(e.message);
  } finally {
    console.groupEnd();
  }
};

const buyAll = ({good, subscriptions = []}) => {
  console.group(`[autobuy.service] -> [buyAll]`, {good, subscriptions});
  if (!isGoodShopSupported(good))
    throw new Error(`Shop doesn't supported shop_id: ${good.shop_id}`);
  try {
    subscriptions.forEach(async subscription => {
      await buy({good, subscription});
    });
    log(`[buyAll] done`);
  } catch (e) {
    console.error(e.message);
  } finally {
    console.groupEnd();
  }
};

const isGoodShopSupported = ({url}) => {
  return autobuyInstances.some(instance => instance.isMyUrl(url));
};

const getInstanceByUrl = (url) => {
  return autobuyInstances.find(instance => instance.isMyUrl(url));
};

module.exports = {
  buy: buyAll
};