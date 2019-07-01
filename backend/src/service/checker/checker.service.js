const pandaoChecker = require('./pandaoChecker.service');
const goodsService = require('../goods.service');
const vkService = require('../vk.service');
const moment = require('moment');
const checkerList = [pandaoChecker];

let processGoods = [];
let interval;
const INTERVAL_TIME_MINUTES = 10;

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
    // try {
        const expireDate = moment().subtract(INTERVAL_TIME_MINUTES, "minutes");
        const goods = await goodsService.search({expireDate});
        if (goods.length > 0) {
            push(goods);
            if (!state.isParsing) {
                backgroundProcess();
            }
            log(`[scan] done`, state);
        } else {
            log(`[scan] nothing to parse`, state);
        }
    // } catch (e) {
    //     log(`[scan] error`, e.message);
    //     return state;
    // }
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

const parse = async (url) => {
  if (!isShopSupported(url))
    throw new Error(`Shop doesn't supported.`);
  const checkerInstance = getCheckerForUrl(url);
  return await checkerInstance.parse(url);
};

const refresh = async ({url, id, price = 0}) => {
  if (!url)
    throw new Error(`Good url required.`);
  if (!id)
    throw new Error(`Good id required.`);
  
  const parsedGood = await parse(url);
  
  let good;
  if (isValid(parsedGood)) {
    good = await goodsService.update({
      ...parsedGood,
      id
    });
  } else {
    good = await goodsService.inactive({ id });
  }

  const isNotificationsRequired = parsedGood.price < price;
  if (isNotificationsRequired) {
    vkService.notifyAll(good);
  }

  log(`[refresh] done`, good);
  return good;
};

const isValid = ({url, title, price}) => {
  return !!url && !!title && !!price;
};

const status = () => {
  log(`[status] done`, state);
  return state;
};

const addUrl = async (url) => {
  if (!isShopSupported(url))
    throw new Error(`Shop doesn't supported.`);
  
  const addedGood = await goodsService.addUrl({url});
  const good = await refresh(addedGood);
  log(`[addUrl] done`, good);
  return good;
};

// const addByUrl = async (url) => {
//   if (!isShopSupported(url))
//     throw new Error(`Shop doesn't supported.`);
//   const parsedGood = await parse(url);
//   if ()
// };

const log = (text, params = '') => {
  console.log(`[checker.service] -> ${text}`, params);
};

module.exports = {
  // parse,
  start,
  stop,
  scan,
  status,
  addUrl,
  isShopSupported
};