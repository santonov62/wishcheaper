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

const parse = async (url) => {
  
  if (!url)
    throw new Error(`Url required.`);
  
  const proxy = await proxyHolderService.pullProxy();
  
  let launchParams = { args: [ `--proxy-server=${proxy.ip}`, `--no-sandbox` ] };
  if (isDebugMode)
    launchParams = { ...launchParams, headless: false };

  const browser = await puppeteer.launch(launchParams);

  try {
    const page = await browser.newPage();

    log(`goto: `, url);
    // await page.goto(url, {waitUntil: 'domcontentloaded', timeout: TIMEOUT_DELAY});
    try {
      await page.goto(url, {waitUntil: 'domcontentloaded', timeout: 30000});
    } catch (e) {

    }
    log(`done`);

    let title, currentPrice, logo, oldPrice;
    try {
      log(`$eval title`);
      title = await page.$eval('.title-info-title-text', node => node.innerText);
      log(`$eval price`);
      currentPrice = await page.$eval('.js-item-price', node => node.getAttribute('content'));
      log(`$eval oldPrice`);
      oldPrice = await page.$eval('.item-price-old', node => parseInt(node.innerText.replace(/\s+/g, '')));
      log(`logo`);
      logo = await page.$eval('.gallery-img-frame', node => node.getAttribute('data-url').replace(/\/\//, 'https://'));
    } catch (e) {

    }
    const parsedData = {
        url,
        title,
        price: currentPrice,
        old_price: oldPrice,
        logo
    };
    
    log(`[parse] done`, parsedData);
    if (!!title)
      proxyHolderService.pushProxy(proxy);

    return parsedData;

  } catch (e) {
    throw new Error(e);
  } finally {
    // if (!isDebugMode)
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