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

const backgroundProcess = async () => {
  try {
    state.isParsing = true;
    const result = [];
    while (processGoods.length > 0) {
      const good = processGoods.shift();
      const refreshedGood = await checkerService.refresh(good);
      if (!!refreshedGood)
        result.push(refreshedGood);
    }
    log(`[backgroundProcess] done parsed: `, result.length);
  } catch (e) {
      log(`[backgroundProcess] error`, e.message);
  } finally {
    state.isParsing = false;
    state.lastParseTime = Date.now();
  }
  // log(`[backgroundProcess] done parsed: `, result.length);
  // return result;
};


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

const start = async () => {
  log(`[start]`);
  const shops = await getAllShops(true);
  const intervalMin = Math.min.apply(null, shops.map(shop => shop.scan_interval)) || 720;
  scan();
  interval = setInterval(() => {
    scan();
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