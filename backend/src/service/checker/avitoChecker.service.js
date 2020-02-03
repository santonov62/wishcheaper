const puppeteer = require('puppeteer');
const shopService = require('../shops.service');
const proxyHolder = require('../../module/proxyHolder');
const isDebugMode = false;
const TIMEOUT_DELAY = 30000;
const SHOP_NAME = 'avito.ru';
const SHOP_TITLE = 'Avito';
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];

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

const parse = async (url, attempts = 0) => {
  attempts++;
  if (!url)
    throw new Error(`Url required.`);

  let launchParams = {args: [`--no-sandbox`]};
  const proxy = await proxyHolder.pullProxy(url);
  if (!!proxy && !!proxy.ip) {
    launchParams = {args: [`--proxy-server=${proxy.ip}`, `--no-sandbox`]};
  }

  if (isDebugMode)
    launchParams = { ...launchParams, headless: false };

  const browser = await puppeteer.launch(launchParams);

  try {
    const page = await browser.newPage();

    log(`goto: `, url);
    try {
      await page.emulate(iPhone);
      await page.goto(url, {waitUntil: 'domcontentloaded'});
    } catch (e) {
      browser.close();
      if (attempts < 5)
        return await parse(url, attempts);
    }

    let title, currentPrice, logo, oldPrice, inactive_at;

    log(`inactive_at`);
    try {
      const el = await page.$eval('.b-404', node => node);
      if (!!el)
        inactive_at = new Date();
    } catch (e) { }

    log(`$eval title`);
    try {
      // title = await page.$eval('.title-info-title-text', node => node.innerText);
      title = await page.$eval('[data-marker="item-description/title"]', node => node.innerText);
    } catch (e) { }
    log(`done`);

    log(`$eval price`);
    try {
      // currentPrice = await page.$eval('.js-item-price', node => parseInt(node.getAttribute('content')));
      currentPrice = await page.$eval('[data-marker="item-description/price"]', node => parseInt(node.innerText.replace(/[^0-9]/g, '')));
    } catch (e) {
      inactive_at = new Date();
    }
    log(`done`);

    log(`$eval oldPrice`);
    try {
      // oldPrice = await page.$eval('.item-price-old', node => parseInt(node.innerText.replace(/\s+/g, '')));
      oldPrice = await page.$eval('[data-marker="item-description/old-price"]', node => parseInt(node.innerText.replace(/[^0-9]/g, '')));
    } catch (e) { }
    log(`done`);

    log(`logo`);
    try {
      // logo = await page.$eval('.gallery-img-frame img', node => node.getAttribute('src').replace(/\/\//, 'https://'));
      logo = await page.$eval('.lazy-load-image-background img', node => node.src);
    } catch (e) { }
    log(`done`);

    const parsedData = {
        url,
        title,
        price: currentPrice,
        old_price: oldPrice,
        logo,
        inactive_at
    };
    
    log(`[parse] done`, parsedData);
    if (!!title) {
      proxyHolder.unshiftProxy(proxy);
    }

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