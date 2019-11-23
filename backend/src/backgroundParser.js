const goodsService = require('./service/goods.service');
const checkerService = require('./service/checker/checker.service');
const shopsService = require('./service/shops.service');

let processGoods = [];
let interval;

const state = {
  isStarted: false,
  isParsing: false,
  time: null,
  lastParseTime: null
};


let shops;
const getAllShops = async (force) => {
  if(!shops || force)
    shops = await shopsService.getAll();
  return shops;
};

const parse = async () => {
  try {
    state.isParsing = true;
    const result = [];
    while (processGoods.length > 0) {
      const good = processGoods.shift();
      const refreshedGood = await checkerService.refresh(good);
      if (!!refreshedGood)
        result.push(refreshedGood);
    }
    log(`[parse] done parsed: `, result.length);
  } catch (e) {
      log(`[parse] error`, e.message);
  } finally {
    state.isParsing = false;
    state.lastParseTime = Date.now();
  }
};


const parseExpiredGoods = async () => {
  shops = await getAllShops();
  const goods = await goodsService.expired(shops);
  log(`[parseExpiredGoods] expiredGoods`, goods.length);
  if (goods.length > 0) {
    push(goods);
    if (!state.isParsing) {
      parse();
    }
    log(`[parseExpiredGoods] done`, state);
  } else {
    log(`[parseExpiredGoods] nothing to parse`, state);
  }
  return state;
}

const start = async () => {
  log(`[start]`);
  const shops = await getAllShops(true);
  const intervalMin = Math.min.apply(null, shops.map(shop => shop.scan_interval)) || 720;
  parseExpiredGoods();
  interval = setInterval(() => {
    parseExpiredGoods();
  }, intervalMin * 60000 / 2);
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

const status = () => {
  log(`[status] done`, state);
  return state;
};

const log = (text, params = '') => {
  console.log(`[backgroundParser.service] -> ${text}`, params);
};

start();