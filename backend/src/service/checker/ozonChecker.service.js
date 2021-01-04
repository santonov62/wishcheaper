const puppeteer = require('puppeteer');
const shopService = require('../shops.service');
const TIMEOUT_DELAY = 30000;
const SHOP_NAME = 'ozon.ru';
const SHOP_TITLE = 'Ozone';
const iPhone = puppeteer.devices['iPhone 6'];
const SCAN_INTERVAL_MINUTES = 720;

const log = (text, params = '') => {
  console.log(`[ozonChecker.service] -> ${text}`, params);
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
    await page.goto(url, {waitUntil: 'domcontentloaded', timeout: TIMEOUT_DELAY});
    
    let title, currentPrice, logo, oldPrice, inactive_at;
    log(`title`);
    try {
      await page.waitForSelector('[data-widget="webProductHeading"]', { visible: true });
      title = await page.$eval('[data-widget="webProductHeading"]', node => node.textContent);
    } catch (e) {
      console.error(e);
    }

    log(`prices`);
    let prices;
    try {
      await page.waitForSelector('[data-widget="webPrice"]', { visible: true });
      prices = await page.$eval('[data-widget="webPrice"]', node => {
        const text = node.innerText.split('\n');
        console.log(text)
        const pricesBox = text[text.length - 1];
        return pricesBox.replace(/\s/g, '').split('₽');
      });
    } catch (e) {
      console.error(e);
    }

    log(`price`);
    try {
      currentPrice = parseInt(prices[0]);
    } catch (e) {
      console.error(e);
    }
  
    log(`oldPrice`);
    try {
      oldPrice = parseInt(prices[1]);
    } catch (e) {
      console.error(e);
    }

    log(`logo`);
    try {
      logo = await page.$eval('[data-widget="webMobGallery"] img', node => node.getAttribute('src'));
    } catch (e) {
      console.error(e);
    }

    try {
      const inactive = await page.$('[data-widget="webOutOfStock"]');
      const addToCardText = await page.$eval('[data-widget="webAddToCart"]', node => node.textContent);
      const notifyAvailable = addToCardText && addToCardText.indexOf('поступлении') > 0;
      if (!!inactive || notifyAvailable || !currentPrice) {
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