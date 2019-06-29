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
  log(`[refresh] ${goodId}`, good);
  return good;
};

const log = (text, params = '') => {
  console.log(`[checker] ${text}`, params);
};

module.exports = {
  parse,
  refresh
};