const puppeteer = require('puppeteer');
const shopService = require('../shops.service');
const proxyHolderService = require('./proxyHolder.service');
const isDebugMode = false;
const TIMEOUT_DELAY = 30000;
const SHOP_NAME = 'avito.ru';
const SHOP_TITLE = 'Avito';

const log = (text, params = '') => {
  console.log(`[avitoChecker.service] -> ${text}`, params);
};

const init = async () => {
  const shop = await shopService.getShopByUrl(SHOP_NAME);
  if (!shop) {
    const addedShop = await shopService.save({
      title: SHOP_TITLE,
      url: `https://${SHOP_NAME}`,
      name: SHOP_NAME,
      scan_interval: 720});
    log(`[init] added shop`, addedShop);
  }
};

init();

let proxy;

const parse = async (url, attempts = 0) => {
  attempts++;
  if (!url)
    throw new Error(`Url required.`);

  if (!proxy)
    proxy = await proxyHolderService.pullProxy();

  let launchParams = { args: [ `--proxy-server=${proxy.ip}`, `--no-sandbox` ] };

  // const proxy = await proxyHolderService.pullProxy();
  // let launchParams = { args: [ `--no-sandbox` ] };

  if (isDebugMode)
    launchParams = { ...launchParams, headless: false };

  const browser = await puppeteer.launch(launchParams);

  try {
    const page = await browser.newPage();

    log(`goto: `, url);
    try {
      await page.goto(url, {waitUntil: 'domcontentloaded', timeout: 15000});
    } catch (e) {
      proxy = null;
      browser.close();
      if (attempts < 5)
        return await parse(url, attempts);
    }
    log(`done`);

    // await page.waitFor(`.gallery-img-frame`);

    let title, currentPrice, logo, oldPrice;

    log(`$eval title`);
    try {
      title = await page.$eval('.title-info-title-text', node => node.innerText);
    } catch (e) { }

      log(`$eval price`);
    try {
      currentPrice = await page.$eval('.js-item-price', node => parseInt(node.getAttribute('content')));
    } catch (e) { }

    log(`$eval oldPrice`);
    try {
      oldPrice = await page.$eval('.item-price-old', node => parseInt(node.innerText.replace(/\s+/g, '')));
    } catch (e) { }

    log(`logo`);
    try {
      logo = await page.$eval('.gallery-img-frame img', node => node.getAttribute('src').replace(/\/\//, 'https://'));
    } catch (e) { }

    const parsedData = {
        url,
        title,
        price: currentPrice,
        old_price: oldPrice,
        logo
    };
    
    log(`[parse] done`, parsedData);
    if (!!title)
      proxyHolderService.unshiftProxy(proxy);

    return parsedData;

  } catch (e) {
    throw new Error(e);
  } finally {
    await browser.close();
  }
};

const isMyUrl = (url) => {
  return url.indexOf(SHOP_NAME) !== -1;
};

module.exports = {
  parse,
  isMyUrl,
  getShopUrl: () => SHOP_NAME
};