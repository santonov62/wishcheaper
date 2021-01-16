const puppeteer = require('puppeteer');
const shopService = require('../shops.service');
const TIMEOUT_DELAY = 30000;
const SHOP_NAME = 'eldorado.ru';
const SHOP_TITLE = 'Эльдорадо';
const proxyHolder = require('../../module/proxyHolder');
const iPhone = puppeteer.devices['iPhone 6'];

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

const parse = async (url, launchParams ) => {

  const browser = await puppeteer.launch({ ...launchParams, headless: !process.env.PUPPETEER_DEV });
  try {
    const page = await browser.newPage();
    await page.emulate(iPhone);
    await page.goto(url, {waitUntil: 'domcontentloaded'});

    let title, currentPrice, logo, oldPrice;
    log(`title`);
    try {
      title = await page.$eval('.page_name__title', node => node.innerText);
    } catch (e) { }

    log(`price`);
    try {
      currentPrice = await page.$eval('.container .new-price', node => parseInt(node.innerText.replace(/[^0-9,]/g, '')));
    } catch (e) { }

    log(`oldPrice`);
    try {
      oldPrice = await page.$eval('.container .old-price', node => parseInt(node.innerText.replace(/[^0-9,]/g, '')));
    } catch (e) { }

    log(`logo`);
    try {
      logo = await page.$eval('.container .preview-item-body__img', node => node.getAttribute('src'))
    } catch (e) { }

    let inactive_at;
    const payButton = await page.$('.preview-add .js-add-to-basket');
    if (!payButton) {
      inactive_at = new Date();
    }

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
  getShopUrl: () => SHOP_NAME,
  withProxy: true
};