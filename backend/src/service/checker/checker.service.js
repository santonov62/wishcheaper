const pandaoChecker = require('./pandaoChecker.service');
const avitoChecker = require('./avitoChecker.service');
const mvideoChecker = require('./mvideoChecker.service');
const goodsService = require('../goods.service');
const vkService = require('../vk.service');
const db = require('../db.service');
const subscriptionService = require('../subscriptions.service');
const shopsService = require('../shops.service');

const moment = require('moment');
const checkerList = [
  pandaoChecker,
  avitoChecker,
  mvideoChecker
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
            result.push(await refresh(good));
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
getAllShops = async (force) => {
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

  if (goods.length)
    processGoods = processGoods.concat(goods);
  else
    processGoods.push(goods);

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

const refresh = async ({url, id, price, prev_price, inactive_at, old_price}) => {
  // console.group(`[checker.service] -> [refresh] good_id: ${id}`);
  if (!url)
    throw new Error(`Good url required.`);
  if (!id)
    throw new Error(`Good id required.`);
  
  const parsedGood = await parse(url);
  
  let good;
  if (isGoodExists(parsedGood)) {
    
    const newPrice = parsedGood.price;
    if (!prev_price || newPrice !== price)
      prev_price = price;
    
    good = await goodsService.update({
      ...parsedGood,
      prev_price,
      id
    });

    // const isCheaperProductBecomeAvailable = !!inactive_at && price < prev_price;
    const isDiscountProductBecomeAvailable = !!inactive_at && (price < old_price || price < prev_price);
    const IsProductBecomeCheaper = newPrice < price;
    if (IsProductBecomeCheaper || isDiscountProductBecomeAvailable) {
      vkService.notifyAll({...good, prev_price});
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

const isGoodExists = ({url, title, price}) => {
  return !!url && !!title && !!price;
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

module.exports = {
  // parse,
  start,
  stop,
  scan,
  status,
  addByUrl,
  additionalGoodData
};