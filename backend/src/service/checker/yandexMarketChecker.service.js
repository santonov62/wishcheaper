const puppeteer = require('puppeteer');
const shopService = require('../shops.service');
const SHOP_NAME = 'market.yandex.ru';
const SHOP_TITLE = 'Яндекс Маркет';
const iPhone = puppeteer.devices['iPhone 6'];
const SCAN_INTERVAL_MINUTES = 180;

const log = (text, params = '') => {
  console.log(`[yandexMarket.service] -> ${text}`, params);
};

const init = async () => {
  const shop = await shopService.getShopByUrl(SHOP_NAME);
  if (!shop) {
    const addedShop = await shopService.save({
      title: SHOP_TITLE,
      url: `https://${SHOP_NAME}`,
      name: SHOP_NAME,
      scan_interval: SCAN_INTERVAL_MINUTES});
    log(`[init] added shop`, addedShop);
  }
};

init();

const parse = async (url, launchParams) => {

  const browser = await puppeteer.launch(launchParams);
  try {
    const page = await browser.newPage();
    await page.emulate(iPhone);

    log(`goto: `, url);
    await page.goto(url, {waitUntil: 'networkidle2'});

    let title, currentPrice, logo, oldPrice, inactive_at;
    log(`title`);
    try {
      title = await page.$eval('[data-zone-name="summary"] h1', node => node.textContent);
    } catch (e) {
      console.error(e);
    }

    //PRICE
    log(`price`);
    try {
      currentPrice = await page.$eval('[data-auto="price"]', node => parseInt(node.innerText.replace(/\s+/g, '')));
    } catch (e) {
      inactive_at = new Date();
    }

    //OLD PRICE
    log(`oldPrice`);
    try {
      oldPrice = await page.$eval('[data-auto="old-price"]', node => parseInt(node.innerText.replace(/\s+/g, '')));
    } catch (e) {
      // console.error(e);
    }

    log(`logo`);
    try {
      logo = await page.$eval('picture img', node => node.getAttribute('src'));
    } catch (e) {
      // console.error(e);
    }

    // inactive
    try {
      const payButton = await page.$('[data-zone-name="cartButton"] button');
      if (!payButton)
        inactive_at = new Date();
    } catch (e) {
      // console.error(e);
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
  getShopUrl: () => SHOP_NAME
};