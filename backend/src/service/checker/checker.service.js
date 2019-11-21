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

const backgroundProcess = async () => {
    const result = [];
    try {
        state.isParsing = true;
        while (processGoods.length > 0) {
            const good = processGoods.shift();
            const refreshedGood = await refresh(good);
            result.push(refreshedGood);
        }
        state.lastParseTime = Date.now();
        state.isParsing = false;
        log(`[backgroundProcess] done parsed: `, result.length);
        return result;
    } catch (e) {
        state.isParsing = false;
        log(`[backgroundProcess] error`, e.message);
        return result;
    }
}


const scan = async () => {
  shops = await getAllShops();

  const goods = await goodsService.expired(shops);
  // const goods = await goodsService.search({id: 17});
  if (goods.length > 0) {
    push(goods);
    if (!state.isParsing) {
      backgroundProcess();
    }
    log(`[scan] done`, state);
  } else {
    log(`[scan] nothing to parse`, state);
  }
  return state;
}

let shops;
const getAllShops = async (force) => {
  if(!shops || force)
    shops = await shopsService.getAll();
  return shops;
};

const start = async () => {
  const shops = await getAllShops(true);
  const intervalMin = Math.min.apply(null, shops.map(shop => shop.scan_interval)) || 720;
  scan();
  interval = setInterval(() => {
    scan();
  }, intervalMin / 2 * 60000);
  state.isStarted = true;
  state.time = Date.now();
  log(`[start] done`, state);
  return state;
}


const stop = () => {
  clearInterval(interval);
  state.isStarted = false;
  state.time = Date.now();
  log(`[stop] done`, state);
  return state;
}

const push = (goods) => {
  if (!goods)
    return;

  goods = [].concat(goods);

  const filteredGoods = goods.filter(good => {
    return !processGoods.some(processGood => {
      return processGood.id === good.id
    })
  });

  processGoods = processGoods.concat(filteredGoods);

  return processGoods;
}

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
  // console.group(`[checker.service] -> [refresh] good_id: ${id}`);
  if (!id)
    throw new Error(`Good id required.`);

  let isProductExpired = 40 < moment.duration(moment().diff(new Date(updated_at))).asDays();
  if (isProductExpired) {
    await subscriptionService.remove({goodId: id});
    await goodsService.remove({id});
    throw new Error(`Product expired and removed.`);
  }

  if (!url)
    throw new Error(`Good url required.`);

  const parsedGood = await parse(url);
  
  let good;
  const isCorrectUrl = !!parsedGood.url && !!parsedGood.title;
  if (isCorrectUrl) {
    
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
      const priceShift = !!parsedGood.currency ? 1 : price * 0.005; // 0,5%
      const priceWithShifting = price + priceShift;
      const isDiscountedProductBecameAvailable = !!inactive_at && (priceWithShifting < old_price || priceWithShifting < prev_price);
      const isProductBecameCheaper = newPrice + priceShift < price;
      if (isProductBecameCheaper || isDiscountedProductBecameAvailable) {
        const notifySubscriptions = await subscriptionService.requireNotification({...good});
        vkService.notifyGoodBecameCheaper({good: {...good, prev_price}, subscriptions: notifySubscriptions});
        // const buySubscriptions = await subscriptionService.requireBuy({...good});
        // if (buySubscriptions && buySubscriptions.length > 0) {
        //   autobuyService.buy({good: {...good, prev_price}, subscriptions: buySubscriptions});
        // }
      }
    }

  } else {
    good = await goodsService.inactive({ id });
  }

  log(`[refresh] done`, good);
  // console.groupEnd();
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

const status = () => {
  log(`[status] done`, state);
  return state;
};

const addByUrl = async (url) => {

  if (!url)
    throw new Error(`url required`);


  if (!isShopSupported(url))
    throw new Error(`Shop doesn't supported.`);
  
  const addedGood = await goodsService.addByUrl({url});
  let good = await refresh(addedGood);
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
  // parse,
  start,
  stop,
  scan,
  status,
  addByUrl,
  additionalGoodData,
  getClippedUrl
};