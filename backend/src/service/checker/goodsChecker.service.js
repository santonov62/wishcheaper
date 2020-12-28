const puppeteer = require('puppeteer');
const shopService = require('../shops.service');
const TIMEOUT_DELAY = 30000;
const SHOP_NAME = 'goods.ru';
const SHOP_TITLE = 'Goods';
const iPhone = puppeteer.devices['iPhone 6'];

const log = (text, params = '') => {
  console.log(`[goodsChecker.service] -> ${text}`, params);
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
    await page.emulate(iPhone);

    log(`goto: `, url);
    await page.goto(url, {waitUntil: 'domcontentloaded', timeout: TIMEOUT_DELAY});
    // log(`done`);
    
    let title, currentPrice, logo, oldPrice;
    log(`title`);
    try {
      title = await page.$eval('.page-title', node => node.innerText);
    } catch (e) {
      console.error(e);
    }
    log(`price`);
    try {
      currentPrice = await page.$eval('.pdp-offer-block__price', node => parseInt(node.innerText.replace(/\s/g, '')));
    } catch (e) { }
    try {
      if (!currentPrice)
        currentPrice = await page.$eval('.last-price', node => parseInt(node.innerText.replace(/\s/g, '')));
    } catch (e) { }
    
    log(`logo`);
    try {
      logo = await page.$eval('.lory-slider__item.swiper__item.active img', node => node.getAttribute('src'))
    } catch (e) {
      console.error(e);
    }

    let inactive_at;
    try {
      const unavailableButton = await page.$('.components_unavailableProductSubscriptionButton__button_0');
      if (!!unavailableButton) {
        inactive_at = new Date();
      }
    } catch (e) {
      console.error(e);
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