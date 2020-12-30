const puppeteer = require('puppeteer');
const shopService = require('../shops.service');
const TIMEOUT_DELAY = 30000;
const SHOP_NAME = 'eldorado.ru';
const SHOP_TITLE = 'Эльдорадо';
const proxyHolder = require('../../module/proxyHolder');

const log = (text, params = '') => {
  console.log(`[eldoradoChecker.service] -> ${text}`, params);
};

const init = async () => {
  const shop = await shopService.getShopByUrl(SHOP_NAME);
  if (!shop) {
    const addedShop = await shopService.save({
      title: SHOP_TITLE,
      url: `https://${SHOP_NAME}`,
      name: SHOP_NAME,
      scan_interval: 240});
    log(`[init] added shop`, addedShop);
  }
};

init();

const parse = async (url) => {

  if (!url)
    throw new Error(`Url required.`);

  let launchParams = { args: [ `--no-sandbox` ], headless: true };
  const proxy = await proxyHolder.pullProxy(url);
  if (!!proxy && !!proxy.ip) {
    launchParams = {args: [`--proxy-server=${proxy.ip}`, `--no-sandbox`]};
  }

  const browser = await puppeteer.launch({ ...launchParams, headless: !process.env.PUPPETEER_DEV });

  try {
    const page = await browser.newPage();

    log(`goto: `, url);
    await page.goto(url, {waitUntil: 'domcontentloaded', timeout: TIMEOUT_DELAY});
    // log(`done`);

    let inactive_at;
    const payButton = await page.$('.priceContainer .addToCartBigRP');
    if (!payButton) {
      inactive_at = new Date();
    }

    let title, currentPrice, logo, oldPrice;
    log(`title`);
    try {
      title = await page.$eval('.catalogItemDetailHd', node => node.innerText);
    } catch (e) { }

    log(`price`);
    try {
      currentPrice = await page.$eval('.priceContainer .product-box-price__active', node => parseInt(node.innerText.replace(/[^0-9,]/g, '')));
    } catch (e) { }

    log(`oldPrice`);
    try {
      oldPrice = await page.$eval('.product-box-price__old-el', node => parseInt(node.innerText.replace(/[^0-9,]/g, '')));
    } catch (e) { }

    log(`logo`);
    try {
      logo = await page.$eval('.slider-with-preview .slider-item-active img', node => node.getAttribute('src'))
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