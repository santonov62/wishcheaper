const puppeteer = require('puppeteer');
const shopService = require('../shops.service');
const isDebugMode = false;
const TIMEOUT_DELAY = 30000;
const SHOP_NAME = 'leroymerlin.ru';
const SHOP_TITLE = 'Leroy Merlin';

const log = (text, params = '') => {
  console.log(`[leroymerlinChecker.service] -> ${text}`, params);
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
    const payButton = await page.$('.add-to-cart.btn.dark-red-button');
    if (!payButton) {
      inactive_at = new Date();
    }

    let title, currentPrice, logo, oldPrice;
    log(`title`);
    try {
      title = await page.$eval('.pdp-detailed__header-title', node => node.innerText);
    } catch (e) { }

    log(`price`);
    try {
      currentPrice = await page.$eval('.card-order-price-int', node => parseInt(node.innerText.replace(/\s/g, '')));
    } catch (e) { }

    // log(`oldPrice`);
    // try {
    //   oldPrice = await page.$eval('***********************', node => parseInt(node.innerText.replace(/\s/g, '')));
    // } catch (e) { }

    log(`logo`);
    try {
      logo = await page.$eval('.pdp-product-img__cover.pdp-product-img--shown img', node => node.getAttribute('src'))
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