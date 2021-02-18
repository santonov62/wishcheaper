const puppeteer = require('puppeteer');
const shopService = require('../shops.service');
const isDebugMode = false;
const TIMEOUT_DELAY = 30000;
const SHOP_NAME = 'computeruniverse.net';
const SHOP_TITLE = 'Computeruniverse';
const iPhone = puppeteer.devices['iPhone 6'];

const log = (text, params = '') => {
  console.log(`[computeruniverseChecker.service] -> ${text}`, params);
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

  let launchParams = { args: [ `--no-sandbox` ], headless: !process.env.PUPPETEER_DEV };

  const browser = await puppeteer.launch(launchParams);

  try {
    const page = await browser.newPage();
    // await page.emulate(iPhone);

    log(`goto: `, url);
    await page.goto(url, {waitUntil: 'domcontentloaded', timeout: TIMEOUT_DELAY});
    // log(`done`);

    let inactive_at;
    const payButton = await page.$('.add-to-cart-button');
    if (!payButton) {
      inactive_at = new Date();
    }

    let title, currentPrice, logo, oldPrice, currency;
    log(`title`);
    try {
      title = await page.$eval('.at__productheadline', node => node.innerText);
    } catch (e) { }

    log(`currency`);
    try {
      currency = await page.$eval('.PriceCurrency', node => node.innerText);
    } catch (e) { }

    log(`price`);
    try {
      currentPrice = await page.$eval('.product-price', node => parseInt(node.innerText.replace(/[^0-9,]/g, '')));
    } catch (e) { }

    log(`oldPrice`);
    try {
      oldPrice = await page.$eval('.old-product-price', node => parseInt(node.innerText.replace(/[^0-9,]/g, '')));
    } catch (e) { }

    log(`logo`);
    try {
      logo = await page.$eval('.at__pd__picture-image img', node => node.src)
    } catch (e) { }

    const parsedData = {
      url,
      title,
      price: currentPrice,
      old_price: oldPrice,
      logo,
      inactive_at,
      currency
    };

    log(`[parse] done`, parsedData);

    return parsedData;

  } catch (e) {
    throw new Error(e);
  } finally {
    if (!process.env.PUPPETEER_KEEP_OPENED)
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