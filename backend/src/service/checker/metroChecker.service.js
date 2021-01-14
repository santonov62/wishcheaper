const puppeteer = require('puppeteer');
const shopService = require('../shops.service');
const TIMEOUT_DELAY = 30000;
const SHOP_NAME = 'metro-cc.ru';
const SHOP_TITLE = 'Metro';
const iPhone = puppeteer.devices['iPhone 6'];
const SCAN_INTERVAL_MINUTES = 720;

const log = (text, params = '') => {
  console.log(`[metroChecker.service] -> ${text}`, params);
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

const parse = async (url) => {
  
  if (!url)
    throw new Error(`Url required.`);

  let launchParams = { args: [ `--no-sandbox` ], headless: !process.env.PUPPETEER_DEV };

  const browser = await puppeteer.launch(launchParams);

  try {
    const page = await browser.newPage();
    await page.emulate(iPhone);

    log(`goto: `, url);
    await page.goto(url, {waitUntil: 'networkidle2', timeout: TIMEOUT_DELAY});
    
    let title, currentPrice, logo, oldPrice, inactive_at;
    log(`title`);
    try {
      title = await page.$eval('.product-page__tablet-title', node => node.textContent);
    } catch (e) {
      console.error(e);
    }

    //PRICE
    log(`$eval price`);
    try {
      currentPrice = await page.$eval('.price-card__price', node => parseInt(node.innerText.replace(/\s+/g, '')));
    } catch (e) {
      inactive_at = new Date();
    }

    //OLD PRICE
    log(`$eval oldPrice`);
    try {
      oldPrice = await page.$eval('.price-card__oldprice', node => parseInt(node.innerText.replace(/\s+/g, '')));
    } catch (e) {
      // console.error(e);
    }

    log(`logo`);
    try {
      // logo = await page.waitForSelector('.product-page__slide-img');
      logo = await page.$eval('.product-page__slide-img', node => node.getAttribute('data-src'));
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