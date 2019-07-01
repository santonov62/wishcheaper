const pandaoChecker = require('./pandaoChecker.service');
const goodsService = require('../goods.service');
const vkService = require('../vk.service');
const moment = require('moment');
const checkerList = [pandaoChecker];


let processGoods = [];
let interval;
const INTERVAL_TIME_MINUTES = 15;

const state = {
  isStarted: false,
  isParsing: false,
  time: null,
  lastParseTime: null
};

const backgroundProcess = async () => {
  state.isParsing = true;
  const result = [];
  while (processGoods.length > 0 && state.isStarted) {
    const good = processGoods.shift();
    result.push(await refresh(good));
  }
  state.lastParseTime = Date.now();
  state.isParsing = false;
  log(`[backgroundProcess] done`, result);
  return result;
}

const scan = async () => {
  const expireDate = moment().subtract(INTERVAL_TIME_MINUTES, "minutes");
  const goods = await goodsService.search({expireDate});
  if (goods.length > 0) {
    push(goods);
    if (!state.isParsing) {
      backgroundProcess();
    }
  }
  log(`[scan] done`, state);
  return state;
}

const start = () => {
  scan();
  interval = setInterval(() => {
    scan();
  }, INTERVAL_TIME_MINUTES / 3 * 60000);
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



const getCheckerForUrl = (url) => {
  return checkerList.find(checker => checker.isMyUrl(url));
};

const parse = async (url) => {
  const checkerInstance = getCheckerForUrl(url);
  if (!checkerInstance)
    throw new Error(`Checker for url doesn't supported. Url: ${url}`);
  try {
    return await checkerInstance.parse(url);
  } catch (e) {
    return null;
  }
};

const refresh = async ({url, id, price = 0}) => {
  if (!url)
    throw new Error(`Good url required.`);
  if (!id)
    throw new Error(`Good id required.`);

  const parsedGood = await parse(url);
  if (!parsedGood) {
    log(`[refresh] done`, `no parsed data`);
    return parsedGood;
  }

  const good = await goodsService.update({
    ...parsedGood,
    id
  });

  const isNotificationsRequired = good.price < price;
  if (isNotificationsRequired) {
    vkService.notifyAll(good);
  }

  log(`[refresh] done`, good);
  return good;
};

const status = () => {
  log(`[status] done`, state);
  return state;
};

addUrl = async (url) => {
  const addedGood = await goodsService.addUrl({url});
  const good = await refresh(addedGood);
  log(`[addUrl] done`, good);
  return good;
};

// const addByUrl = async ({url}) => {
//   const parsedGood = await parse(url);
//   if (!parsedGood)
//     throw new Error(`Good doesn't parsed`);
//   const addedGood = await goodsService.add(parsedGood);
//   log(`[addByUrl] done`, addedGood);
//   return addedGood;
// };

const log = (text, params = '') => {
  console.log(`[checker.service] ${text}`, params);
};

module.exports = {
  parse,
  start,
  stop,
  scan,
  status,
  // addByUrl,
  addUrl,
};