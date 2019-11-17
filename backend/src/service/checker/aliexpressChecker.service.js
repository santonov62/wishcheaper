const puppeteer = require('puppeteer');
const shopService = require('../shops.service');
const isDebugMode = false;
const TIMEOUT_DELAY = 30000;
const SHOP_NAME = 'ru.aliexpress.com';
const SHOP_TITLE = 'Aliexpress';

const log = (text, params = '') => {
  console.log(`[pandaoChecker.service] -> ${text}`, params);
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
    await page.goto(url, {waitUntil: 'networkidle0', timeout: TIMEOUT_DELAY});
    // log(`done`);

    let title, currentPrice, logo, oldPrice, inactive_at;
    log(`title`);
    try {
      title = await page.$eval('.product-title', node => node.innerText);
    } catch (e) { }
    
    log(`price`);
    try {
      currentPrice = await page.$eval('.product-price-current .product-price-value', node => parseInt(node.innerText.replace(/\s/g, '')));
    } catch (e) {
      inactive_at = new Date();
    }
  
    log(`oldPrice`);
    try {
      oldPrice = await page.$eval('.product-price-original .product-price-value', node => parseInt(node.innerText.replace(/\s/g, '')));
    } catch (e) { }
    
    log(`logo`);
    try {
      logo = await page.$eval('.magnifier-image', node => node.getAttribute('src'))
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
  return url.indexOf(SHOP_NAME) !== -1 && url.indexOf('m.ru.') === -1;
};

module.exports = {
  parse,
  isMyUrl,
  getShopUrl: () => SHOP_NAME
};