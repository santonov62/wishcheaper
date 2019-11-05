const puppeteer = require('puppeteer');
const shopService = require('../shops.service');
const isDebugMode = false;
const TIMEOUT_DELAY = 30000;
const SHOP_NAME = 'www.asos.com';
const SHOP_TITLE = 'Asos';
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];

const log = (text, params = '') => {
  console.log(`[asosChecker.service] -> ${text}`, params);
};

const init = async () => {
  const shop = await shopService.getShopByUrl(SHOP_NAME);
  if (!shop) {
    const addedShop = await shopService.save({
      title: SHOP_TITLE,
      url: `https://${SHOP_NAME}`,
      name: SHOP_NAME,
      scan_interval: 720})
    log(`[init] added shop`, addedShop);
  }
};

init();

const parse = async (url) => {

  if (!url)
    throw new Error(`Url required.`);

  let launchParams = { args: [ `--no-sandbox` ], headless: true };
  if (isDebugMode)
    launchParams = { ...launchParams, headless: false };

  const browser = await puppeteer.launch(launchParams);

  try {
    const page = await browser.newPage();
    await page.emulate(iPhone);

    log(`goto: `, url);
    await page.goto(url, {waitUntil: 'domcontentloaded', timeout: TIMEOUT_DELAY});
    // log(`done`);

    let inactive_at;
    const outOfStock = await page.$('.product-out-of-stock-label');
    if (!!outOfStock) {
      inactive_at = new Date();
    }

    let title, currentPrice, logo, oldPrice;
    log(`title`);
    try {
      title = await page.$eval('.product-hero h1', node => node.innerText);
    } catch (e) { }

    log(`price`);
    try {
      currentPrice = await page.$$eval('.current-price', nodes => parseInt(nodes[0].innerText.replace(/\s/g, '')));
    } catch (e) { }

    log(`oldPrice`);
    try {
      oldPrice = await page.$eval('#product-price .product-prev-price:nth-child(4)', node => parseInt(node.innerText.replace(/\s/g, '')));
    } catch (e) { }

    log(`logo`);
    try {
      logo = await page.$$eval('.fullImageContainer img', nodes => nodes[1].getAttribute('src'))
    } catch (e) { }

    const parsedData = {
      url,
      title,
      price: currentPrice,
      old_price: oldPrice,
      logo,
      inactive_at
    };

    log(`[parse] done`, parsedData);

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