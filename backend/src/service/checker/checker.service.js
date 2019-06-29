const pandaoChecker = require('./pandaoChecker.service');
const goodsService = require('../goods.service');
const checkerList = [pandaoChecker];

const getCheckerForUrl = (url) => {
  return checkerList.find(checker => checker.isMyUrl(url));
};

const parse = async (url) => {
  const checker = getCheckerForUrl(url);
  if (!checker)
    throw new Error(`Checker for url doesn't supported. Url: ${url}`);

  return checker.parse(url);
};

const refresh = async (goodId) => {
  const { url } = await goodsService.search({ id: goodId });
  const parsedGood = await parse(url);
  const good = await goodsService.update({
    ...parsedGood,
    id: goodId
  });
  log(`[refresh] goodId: ${goodId}`, good);
  return good;
};

const parseAll = async () => {
  const goods = await goodsService.getAll();
  while (goods.length !== 0) {
    const tasks = [];
    for (let i = 0; goods.length > 0 && i < 5; i++) {
      const { id } = goods.shift();
      tasks.push(refresh(id));
    }
    await Promise.all(tasks);
  }
  log(`[parseAll]`, 'done');
};

let activateInterval = null;
const state = {
  isActive: false,
  time: null,
  delay: 20000
};
const start = () => {
  clearInterval(activateInterval);
  parseAll();
  activateInterval = setInterval(async () => {
    await parseAll();
  }, state.delay);
  state.isActive = true;
  state.time = Date.now();
  return state
};

const stop = () => {
  clearInterval(activateInterval);
  state.isActive = false;
  state.time = Date.now();
  return state;
};

const status = () => {
  return state;
};

const add = async (url) => {
  const parsedGood = await parse(url);
  const good = await goodsService.save(parsedGood);
  return good
};

const log = (text, params = '') => {
  console.log(`[checker.service] ${text}`, params);
};

module.exports = {
  parse,
  refresh,
  start,
  stop,
  status,
  add
};