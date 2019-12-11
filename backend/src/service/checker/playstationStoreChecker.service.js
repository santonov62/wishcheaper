const puppeteer = require('puppeteer');
const shopService = require('../shops.service');
const isDebugMode = false;
const TIMEOUT_DELAY = 30000;
const SHOP_NAME = 'store.playstation.com/ru-ru';
const SHOP_TITLE = 'Playstation Store';

const log = (text, params = '') => {
  console.log(`[playstationStoreChecker.service] -> ${text}`, params);
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

    log(`goto: `, url);
    await page.goto(url, {waitUntil: 'domcontentloaded', timeout: TIMEOUT_DELAY});
    // log(`done`);

    let inactive_at;
    const payButton = await page.$('.desktop-cta--add-to-cart');
    if (!!payButton) {
      inactive_at = new Date();
    }

    let title, currentPrice, logo, oldPrice;
    log(`title`);
    try {
      title = await page.$eval('.pdp__title', node => node.innerText);
    } catch (e) { }

    log(`price`);
    try {
      currentPrice = await page.$eval('.sku-info__price-display .price-display__price', node => parseInt(node.innerText.replace(/\s/g, '')));
    } catch (e) { }

    log(`oldPrice`);
    try {
      oldPrice = await page.$eval('.sku-info__price-display .price-display__strikethrough', node => parseInt(node.innerText.replace(/\s/g, '')));
    } catch (e) { }

    log(`logo`);
    try {
      logo = await page.$eval('.pdp__thumbnail-img .product-image__img .product-image__img--main img', node => node.getAttribute('src'))
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