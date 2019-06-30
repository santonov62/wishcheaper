const pandaoChecker = require('./pandaoChecker.service');
const goodsService = require('../goods.service');
const subscriptionService = require('../subscriptions.service');
const vkService = require('../vk.service');
const checkerList = [pandaoChecker];

const getCheckerForUrl = (url) => {
  return checkerList.find(checker => checker.isMyUrl(url));
};

let activateInterval = null;
const state = {
  isActive: false,
  time: Date.now(),
  delay: 15 * 60000,
  lastParseTime: null
};

const parse = async (url) => {
  const checker = getCheckerForUrl(url);
  if (!checker)
    throw new Error(`Checker for url doesn't supported. Url: ${url}`);

  return checker.parse(url);
};

// const refreshById = async (goodId) => {
//   const good = await goodsService.search({ id: goodId });
//   const refreshedGood = refresh(good);
//   log(`[refreshById]`, refreshedGood);
//   return good;
// };

const refresh = async ({url, id, price}) => {
  if (!url)
    throw new Error(`Good url required.`);
  if (!id)
    throw new Error(`Good id required.`);

  const parsedGood = await parse(url);
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

const parseAll = async () => {
  const goods = await goodsService.getAll();
  let result = [];
  while (goods.length !== 0) {
    const tasks = [];
    // for (let i = 0; goods.length > 0 && i < 5; i++) {
      let good = goods.shift();
      tasks.push(refresh(good));
    // }
    result = result.concat(await Promise.all(tasks));
  }
  state.lastParseTime = Date.now();
  log(`[parseAll] done`, result);
  return result;
};

const start = () => {
  if (state.isActive)
    return state;

  clearInterval(activateInterval);
  parseAll();
  activateInterval = setInterval(async () => {
    await parseAll();
  }, state.delay);
  state.isActive = true;
  state.time = Date.now();
  log(`[start] done`, state);
  return state
};

const stop = () => {
  clearInterval(activateInterval);
  state.isActive = false;
  state.time = Date.now();
  log(`[stop] done`, state);
  return state;
};

const status = () => {
  log(`[status] done`, state);
  return state;
};

const addByUrl = async ({url}) => {
  const parsedGood = await parse(url);
  const addedGood = await goodsService.add(parsedGood);
  log(`[add] done`, addedGood);
  return addedGood;
};

const scan = () => {
  if (state.isActive)
    return state;

  parseAll().then(() => {
    state.time = Date.now();
    state.isActive = false;
  });
  state.time = Date.now();
  state.isActive = true;
  log(`[scan] done`, state);
  return state
};

const log = (text, params = '') => {
  console.log(`[checker.service] ${text}`, params);
};

module.exports = {
  parse,
  // refreshById,
  start,
  stop,
  scan,
  status,
  addByUrl,
};