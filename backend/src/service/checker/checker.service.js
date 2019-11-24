const goodsService = require('../goods.service');
const vkService = require('../vk.service');
const autobuyService = require('../autobuy/autobuy.service');
const db = require('../db.service');
const subscriptionService = require('../subscriptions.service');
const shopsService = require('../shops.service');
const pandaoChecker = require('./pandaoChecker.service');
const avitoChecker = require('./avitoChecker.service');
const mvideoChecker = require('./mvideoChecker.service');
const aliexpressChecker = require('./aliexpressChecker.service');
const tmallAliexpressChecker = require('./tmallAliexpressChecker.service');
const dnsShopChecker = require('./dnsShopChecker.service');
const ozoneChecker = require('./ozoneChecker.service');
const techportChecker = require('./techportChecker.service');
const beruChecker = require('./beruChecker.service');
const goodsChecker = require('./goodsChecker.service');
const lamodaChecker = require('./lamodaChecker.service');
const wildberriesChecker = require('./wildberriesChecker.service');
const jdChecker = require('./jdChecker.service');
const asosChecker = require('./asosChecker.service');
const leroymerlinChecker = require('./leroymerlinChecker.service');
const citilinkChecker = require('./citilinkChecker.service');
const computeruniverseChecker = require('./computeruniverseChecker.service');
const moment = require('moment');

const checkerList = [
  pandaoChecker,
  avitoChecker,
  mvideoChecker,
  aliexpressChecker,
  tmallAliexpressChecker,
  dnsShopChecker,
  ozoneChecker,
  techportChecker,
  beruChecker,
  goodsChecker,
  lamodaChecker,
  jdChecker,
  asosChecker,
  wildberriesChecker,
  leroymerlinChecker,
  wildberriesChecker,
  citilinkChecker,
  computeruniverseChecker
];

let processGoods = [];
let interval;

const state = {
  isStarted: false,
  isParsing: false,
  time: null,
  lastParseTime: null
};

const getCheckerForUrl = (url) => {
  return checkerList.find(checker => checker.isMyUrl(url));
};

const isShopSupported = (url) => {
  return checkerList.some(checker => checker.isMyUrl(url));
};

const parse = async (url) => {
  // console.group(`[checker.service] -> [parse]`);
  if (!isShopSupported(url))
    throw new Error(`Shop doesn't supported.`);
  const checkerInstance = getCheckerForUrl(url);
  const parsedGood = await checkerInstance.parse(url);
  log(`[parse] done`, parsedGood);
  // console.groupEnd();
  return parsedGood
};

const refresh = async ({url, id, price, prev_price, inactive_at, updated_at, old_price, autobuy_price, min_price}) => {
  console.group(`[checker.service] -> [refresh] url: ${url}`);
  let good;
  try {
    if (!id)
      throw new Error(`Good id required.`);

    let isProductExpired = 20 < moment.duration(moment().diff(new Date(updated_at))).asDays();
    if (isProductExpired) {
      await subscriptionService.remove({goodId: id});
      await goodsService.remove({id});
      throw new Error(`Product expired and removed.`);
    }

    if (!url)
      throw new Error(`Good url required.`);

    const parsedGood = await parse(url);

    if (!!parsedGood.title) {

      const newPrice = parsedGood.price;
      if (!prev_price || newPrice !== price)
        prev_price = price;

      const minPrice = !min_price || newPrice < min_price ? newPrice : min_price;

      good = await goodsService.update({
        ...parsedGood,
        min_price: minPrice,
        prev_price,
        id
      });

      const isCorrectProduct = !!parsedGood.url && !!parsedGood.title && !!parsedGood.price && !parsedGood.inactive_at;

      if (isCorrectProduct) {
        const priceShift = !!parsedGood.currency ? 1 : newPrice * 0.005; // 0,5%
        const newPriceWithShifting = newPrice + priceShift;
        const isDiscountedProductBecameAvailable = !!inactive_at && !parsedGood.inactive_at && (newPriceWithShifting < old_price || newPriceWithShifting < prev_price);
        const isProductBecameCheaper = newPriceWithShifting < price;
        if (isProductBecameCheaper || isDiscountedProductBecameAvailable) {
          const notifySubscriptions = await subscriptionService.requireNotification({...good});
          vkService.notifyGoodBecameCheaper({
            good: {...good, prev_price, isDiscountedProductBecameAvailable},
            subscriptions: notifySubscriptions
          });
          // const buySubscriptions = await subscriptionService.requireBuy({...good});
          // if (buySubscriptions && buySubscriptions.length > 0) {
          //   autobuyService.buy({good: {...good, prev_price}, subscriptions: buySubscriptions});
          // }
        }
      }

    } else {
      good = await goodsService.inactive({id});
    }
    log(`[refresh] done`, good);
  } catch (e) {
  //   if (!!id){
  //     good = await goodsService.inactive({id});
  //   }
    log(`[refresh] ERROR`, e.message);
  } finally {
    console.groupEnd();
  }
  return good;
};

const ADDITIONAL_GOOD_DATA = `SELECT
  g.id as good_id,
  su.id as subscription_id,
  su.price_discount,
  su.percent_discount,
  su.price_discount,
  su.percent_discount,
  sh.name as shop_name
FROM goods g
       LEFT JOIN subscriptions as su ON su.good_id = g.id AND su.user_vk = $2
       LEFT JOIN shops as sh ON sh.id = g.shop_id
WHERE
    g.id = $1`;
const additionalGoodData = async ({id, user_vk}) => {
  const result = await db.query(ADDITIONAL_GOOD_DATA, [id, user_vk]);
  return result.rows && result.rows[0];
};

const addByUrl = async (url) => {

  if (!url)
    throw new Error(`url required`);


  if (!isShopSupported(url))
    throw new Error(`Shop doesn't supported.`);
  
  const good = await goodsService.addByUrl({url});
  log(`[addByUrl] done`, good);
  return good;
};

const log = (text, params = '') => {
  console.log(`[checker.service] -> ${text}`, params);
};

const getClippedUrl = (url) => {
  const checker = getCheckerForUrl(url);
  if (!!checker && !!checker.getClippedUrl) {
   return checker.getClippedUrl(url);
  } else {
    const match = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#//=]*)/g);
    return match && match[0];
  }
};

module.exports = {
  addByUrl,
  additionalGoodData,
  getClippedUrl,
  refresh
};